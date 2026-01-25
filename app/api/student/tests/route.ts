import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import Submission from '@/models/Submission';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/api-helpers';

// GET - Get tests for student
export async function GET(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.STUDENT) {
      return NextResponse.json({ error: 'Only students can view their tests' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const userClass = (session.user as any).class;
    const userSection = (session.user as any).section;

    // Get published tests for student's class
    const tests = await Test.find({
      school: session.user.school,
      class: userClass,
      isPublished: true,
      $or: [
        { section: userSection },
        { section: { $exists: false } },
        { section: null },
      ],
    })
      .populate('teacher', 'name')
      .sort({ scheduledDate: -1 })
      .limit(50)
      .lean();

    // Get student's submissions
    const submissions = await Submission.find({
      student: session.user.id,
      submissionType: 'Test',
    }).lean();

    // Combine with submission status
    const now = new Date();
    const testsWithStatus = tests.map((test: any) => {
      const submission = submissions.find(
        (s: any) => s.test?.toString() === test._id.toString()
      );

      const testDate = test.scheduledDate ? new Date(test.scheduledDate) : null;
      const isUpcoming = testDate && testDate > now;
      const isCompleted = !!submission;

      return {
        _id: test._id,
        title: test.title,
        subject: test.subject,
        teacher: test.teacher,
        duration: test.duration,
        totalMarks: test.totalMarks,
        questionCount: test.questions?.length || 0,
        scheduledDate: test.scheduledDate,
        isAIGenerated: test.isAIGenerated,
        submission: submission ? {
          _id: submission._id,
          submittedAt: submission.submittedAt,
          status: submission.status,
          marksObtained: submission.marksObtained,
          percentage: submission.percentage,
          grade: submission.grade,
        } : null,
        isUpcoming,
        isCompleted,
      };
    });

    // Filter by status
    let filteredTests = testsWithStatus;
    if (status === 'upcoming') {
      filteredTests = testsWithStatus.filter((t: any) => t.isUpcoming && !t.isCompleted);
    } else if (status === 'completed') {
      filteredTests = testsWithStatus.filter((t: any) => t.isCompleted);
    }

    return NextResponse.json({ success: true, tests: filteredTests });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/student/tests');
  }
}
