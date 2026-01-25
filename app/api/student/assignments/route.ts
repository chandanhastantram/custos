import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/api-helpers';

// GET - Get assignments for student
export async function GET(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.STUDENT) {
      return NextResponse.json({ error: 'Only students can view their assignments' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const userClass = (session.user as any).class;
    const userSection = (session.user as any).section;

    // Get assignments for student's class
    const assignments = await Assignment.find({
      school: session.user.school,
      class: userClass,
      $or: [
        { section: userSection },
        { section: { $exists: false } },
        { section: null },
      ],
    })
      .populate('teacher', 'name')
      .sort({ dueDate: 1 })
      .limit(50)
      .lean();

    // Get student's submissions
    const submissions = await Submission.find({
      student: session.user.id,
      submissionType: 'Assignment',
    }).lean();

    // Combine assignments with submission status
    const now = new Date();
    const assignmentsWithStatus = assignments.map((assignment: any) => {
      const submission = submissions.find(
        (s: any) => s.assignment?.toString() === assignment._id.toString()
      );

      const dueDate = new Date(assignment.dueDate);
      const isOverdue = dueDate < now && !submission;
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...assignment,
        submission: submission ? {
          _id: submission._id,
          submittedAt: submission.submittedAt,
          status: submission.status,
          marksObtained: submission.marksObtained,
          feedback: submission.feedback,
        } : null,
        isOverdue,
        daysUntilDue,
      };
    });

    // Filter by status
    let filteredAssignments = assignmentsWithStatus;
    if (status === 'pending') {
      filteredAssignments = assignmentsWithStatus.filter((a: any) => !a.submission);
    } else if (status === 'submitted') {
      filteredAssignments = assignmentsWithStatus.filter((a: any) => a.submission && a.submission.status === 'pending');
    } else if (status === 'graded') {
      filteredAssignments = assignmentsWithStatus.filter((a: any) => a.submission && a.submission.status === 'graded');
    }

    return NextResponse.json({ success: true, assignments: filteredAssignments });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/student/assignments');
  }
}
