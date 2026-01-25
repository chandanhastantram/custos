import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { isValidObjectId } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// GET - Get test details with questions (for taking test)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.STUDENT) {
      return NextResponse.json({ error: 'Only students can view test details' }, { status: 403 });
    }

    await dbConnect();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 });
    }

    const userClass = (session.user as any).class;

    const test = await Test.findOne({
      _id: id,
      school: session.user.school,
      class: userClass,
      isPublished: true,
    }).populate('teacher', 'name').lean();

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Remove correct answers from questions
    const questionsWithoutAnswers = (test as any).questions?.map((q: any) => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      topic: q.topic,
      difficulty: q.difficulty,
      options: q.options,
      marks: q.marks,
    })) || [];

    return NextResponse.json({
      success: true,
      test: {
        _id: (test as any)._id,
        title: (test as any).title,
        subject: (test as any).subject,
        teacher: (test as any).teacher,
        duration: (test as any).duration,
        totalMarks: (test as any).totalMarks,
        scheduledDate: (test as any).scheduledDate,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/student/tests/[id]');
  }
}
