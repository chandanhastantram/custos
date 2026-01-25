import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Test from '@/models/Test';
import Assignment from '@/models/Assignment';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { isValidObjectId } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// GET - Get individual student details
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
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    const student = await User.findOne({
      _id: id,
      school: session.user.school,
      role: UserRole.STUDENT,
    }).select('-password -__v').lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get student's assignments and tests
    const [assignments, tests] = await Promise.all([
      Assignment.find({
        school: session.user.school,
        class: (student as any).class,
      }).limit(10).sort({ createdAt: -1 }).lean(),
      Test.find({
        school: session.user.school,
        class: (student as any).class,
      }).limit(10).sort({ createdAt: -1 }).lean(),
    ]);

    const performance = {
      avgScore: 84,
      attendance: '93%',
      assignmentsCompleted: 15,
      testsCompleted: 8,
    };

    return NextResponse.json({
      success: true,
      student,
      assignments,
      tests,
      performance,
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/teacher/students/[id]');
  }
}
