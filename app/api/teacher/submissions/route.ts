import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import Test from '@/models/Test';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { isValidObjectId } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// Validation schemas
const submitTestSchema = z.object({
  testId: z.string().refine(isValidObjectId, 'Invalid test ID'),
  answers: z.array(z.object({
    questionId: z.string(),
    questionText: z.string().optional(),
    studentAnswer: z.string().max(10000),
    maxMarks: z.number().optional(),
  })).min(1, 'At least one answer required'),
});

// Auto-grade MCQ submissions
function autoGradeMCQs(submission: any, test: any) {
  let correctCount = 0;
  let totalMCQMarks = 0;
  let obtainedMarks = 0;

  submission.answers.forEach((answer: any) => {
    const question = test.questions?.find((q: any) => q._id?.toString() === answer.questionId);
    
    if (question && question.type === 'MCQ') {
      totalMCQMarks += question.marks || 1;
      
      if (answer.studentAnswer === question.correctAnswer) {
        correctCount++;
        obtainedMarks += question.marks || 1;
        answer.isCorrect = true;
        answer.marksObtained = question.marks || 1;
      } else {
        answer.isCorrect = false;
        answer.marksObtained = 0;
      }
      
      answer.correctAnswer = question.correctAnswer;
    }
  });

  return {
    autoGradedMarks: obtainedMarks,
    totalMCQMarks: totalMCQMarks || 1,
    correctCount,
  };
}

// POST - Submit and auto-grade test
export async function POST(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = submitTestSchema.parse(body);

    // Get test details
    const test = await Test.findById(validated.testId);
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check for duplicate submission
    const existingSubmission = await Submission.findOne({
      test: validated.testId,
      student: session.user.id,
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Test already submitted' }, { status: 400 });
    }

    // Create submission
    const submission = await Submission.create({
      school: session.user.school,
      test: validated.testId,
      student: session.user.id,
      submissionType: 'Test',
      answers: validated.answers.map((a) => ({
        questionId: a.questionId,
        questionText: a.questionText,
        studentAnswer: a.studentAnswer,
        maxMarks: a.maxMarks || 1,
      })),
      submittedAt: new Date(),
      totalMarks: (test as any).totalMarks || 100,
      status: 'pending',
    });

    // Auto-grade MCQs
    const gradeResult = autoGradeMCQs(submission, test);
    
    // Update submission with auto-graded marks
    submission.marksObtained = gradeResult.autoGradedMarks;
    
    // If all questions are MCQs, mark as graded
    const allMCQs = (test as any).questions?.every((q: any) => q.type === 'MCQ') || false;
    if (allMCQs) {
      submission.status = 'graded';
      submission.percentage = (gradeResult.autoGradedMarks / gradeResult.totalMCQMarks) * 100;
    }
    
    await submission.save();

    return NextResponse.json({
      success: true,
      submission,
      autoGraded: {
        marks: gradeResult.autoGradedMarks,
        totalMCQMarks: gradeResult.totalMCQMarks,
        correctCount: gradeResult.correctCount,
        percentage: (gradeResult.autoGradedMarks / gradeResult.totalMCQMarks) * 100,
      },
      message: allMCQs ? 'Test auto-graded successfully' : 'MCQs auto-graded, theory questions pending review',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/teacher/submissions');
  }
}

// GET - Get submissions for grading (teacher)
export async function GET(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can view submissions' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get('testId');
    const assignmentId = searchParams.get('assignmentId');
    const status = searchParams.get('status');

    const query: any = { school: session.user.school };

    if (testId && isValidObjectId(testId)) query.test = testId;
    if (assignmentId && isValidObjectId(assignmentId)) query.assignment = assignmentId;
    if (status && ['pending', 'graded'].includes(status)) query.status = status;

    const submissions = await Submission.find(query)
      .populate('student', 'name email rollNumber')
      .populate('test', 'title subject')
      .populate('assignment', 'title subject')
      .sort({ submittedAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/teacher/submissions');
  }
}
