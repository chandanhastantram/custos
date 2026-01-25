import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { sanitizeHtml, isValidObjectId } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// Validation schemas
const createAssignmentSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000),
  subject: z.string().min(2).max(100).trim(),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/),
  section: z.string().max(10).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  totalMarks: z.number().min(1).max(1000),
  attachments: z.array(z.string().url()).max(10).optional(),
  instructions: z.string().max(2000).optional(),
  allowLateSubmission: z.boolean().optional(),
  lateSubmissionPenalty: z.number().min(0).max(100).optional(),
});

const updateAssignmentSchema = z.object({
  assignmentId: z.string().refine(isValidObjectId, 'Invalid assignment ID'),
  title: z.string().min(3).max(200).trim().optional(),
  description: z.string().min(10).max(5000).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  totalMarks: z.number().min(1).max(1000).optional(),
});

// GET - List assignments
export async function GET(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can view assignments' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const subject = searchParams.get('subject');

    const query: any = {
      school: session.user.school,
      teacher: session.user.id,
    };

    if (className && /^[0-9]{1,2}[A-Z]?$/.test(className)) query.class = className;
    if (subject && subject.length <= 100) query.subject = subject;

    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Get submission counts
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await Submission.countDocuments({ assignment: assignment._id });
        const graded = await Submission.countDocuments({ assignment: assignment._id, status: 'graded' });
        return { ...assignment, submissions, graded };
      })
    );

    return NextResponse.json({ success: true, assignments: assignmentsWithStats });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/teacher/assignments');
  }
}

// POST - Create assignment
export async function POST(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can create assignments' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = createAssignmentSchema.parse(body);

    // Sanitize HTML in description
    const sanitizedDescription = sanitizeHtml(validated.description);

    const assignment = await Assignment.create({
      school: session.user.school,
      teacher: session.user.id,
      ...validated,
      description: sanitizedDescription,
      dueDate: new Date(validated.dueDate),
    });

    return NextResponse.json({
      success: true,
      assignment,
      message: 'Assignment created successfully',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/teacher/assignments');
  }
}

// PUT - Update assignment
export async function PUT(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can update assignments' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = updateAssignmentSchema.parse(body);
    const { assignmentId, ...updates } = validated;

    // Sanitize description if provided
    if (updates.description) {
      updates.description = sanitizeHtml(updates.description);
    }

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, school: session.user.school, teacher: session.user.id },
      updates,
      { new: true }
    );

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/teacher/assignments');
  }
}

// DELETE - Delete assignment
export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json({ error: 'Only teachers can delete assignments' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get('id');

    if (!assignmentId || !isValidObjectId(assignmentId)) {
      return NextResponse.json({ error: 'Invalid assignment ID' }, { status: 400 });
    }

    const assignment = await Assignment.findOneAndDelete({
      _id: assignmentId,
      school: session.user.school,
      teacher: session.user.id,
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Delete related submissions
    await Submission.deleteMany({ assignment: assignmentId });

    return NextResponse.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error: any) {
    return handleApiError(error, 'DELETE /api/teacher/assignments');
  }
}
