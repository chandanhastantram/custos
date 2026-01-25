import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { isValidObjectId, sanitizeHtml } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// Validation schema
const gradeSubmissionSchema = z.object({
  marksObtained: z.number().min(0).max(10000),
  feedback: z.string().max(2000).optional(),
  answerGrades: z.array(z.object({
    questionId: z.string(),
    marksObtained: z.number().min(0),
  })).optional(),
});

// PUT - Grade a submission
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can grade submissions' }, { status: 403 });
    }

    await dbConnect();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const body = await req.json();
    const validated = gradeSubmissionSchema.parse(body);

    const submission = await Submission.findById(id);
    
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Update individual answer grades if provided
    if (validated.answerGrades && Array.isArray(validated.answerGrades)) {
      validated.answerGrades.forEach((grade) => {
        const answer = submission.answers.find(
          (a: any) => a.questionId === grade.questionId
        );
        if (answer) {
          answer.marksObtained = grade.marksObtained;
          answer.isCorrect = grade.marksObtained === answer.maxMarks;
        }
      });
    }

    // Update submission with sanitized feedback
    submission.marksObtained = validated.marksObtained;
    submission.feedback = validated.feedback ? sanitizeHtml(validated.feedback) : undefined;
    submission.status = 'graded';
    (submission as any).gradedBy = session.user.id;
    submission.gradedAt = new Date();

    await submission.save();

    return NextResponse.json({
      success: true,
      submission,
      message: 'Submission graded successfully',
    });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/teacher/submissions/[id]');
  }
}

// GET - Get single submission details
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const submission = await Submission.findById(id)
      .populate('student', 'name email rollNumber')
      .populate('test', 'title subject')
      .populate('assignment', 'title subject')
      .populate('gradedBy', 'name')
      .lean();

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/teacher/submissions/[id]');
  }
}
