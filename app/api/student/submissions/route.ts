import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { isValidObjectId, sanitizeHtml } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// Validation schema
const submitAssignmentSchema = z.object({
  assignmentId: z.string().refine(isValidObjectId, 'Invalid assignment ID'),
  answers: z.array(z.object({
    questionId: z.string().optional(),
    questionText: z.string().optional(),
    studentAnswer: z.string().max(50000),
  })).min(1),
  attachments: z.array(z.string().url()).max(10).optional(),
});

// POST - Submit assignment
export async function POST(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.STUDENT) {
      return NextResponse.json({ error: 'Only students can submit assignments' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = submitAssignmentSchema.parse(body);

    // Get assignment details
    const assignment = await Assignment.findById(validated.assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: validated.assignmentId,
      student: session.user.id,
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 });
    }

    // Check if late
    const now = new Date();
    const dueDate = new Date((assignment as any).dueDate);
    const isLate = now > dueDate;

    if (isLate && !(assignment as any).allowLateSubmission) {
      return NextResponse.json({ error: 'Late submissions not allowed' }, { status: 400 });
    }

    // Sanitize answers
    const sanitizedAnswers = validated.answers.map((a) => ({
      questionId: a.questionId || 'text',
      questionText: a.questionText || 'Assignment submission',
      studentAnswer: sanitizeHtml(a.studentAnswer),
      maxMarks: (assignment as any).totalMarks,
    }));

    // Create submission
    const submission = await Submission.create({
      school: session.user.school,
      assignment: validated.assignmentId,
      student: session.user.id,
      submissionType: 'Assignment',
      answers: sanitizedAnswers,
      submittedAt: now,
      isLate,
      totalMarks: (assignment as any).totalMarks,
      status: 'pending',
      attachments: validated.attachments || [],
    });

    return NextResponse.json({
      success: true,
      submission,
      message: isLate 
        ? `Assignment submitted late. ${(assignment as any).lateSubmissionPenalty || 0}% penalty may apply.`
        : 'Assignment submitted successfully',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/student/submissions');
  }
}
