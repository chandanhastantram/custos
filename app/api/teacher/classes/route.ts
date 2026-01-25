import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Assignment from '@/models/Assignment';
import Test from '@/models/Test';
import { UserRole } from '@/types/enums';

// GET - List classes for teacher
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: 'Only teachers can view classes' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get unique classes from students
    const classes = await User.aggregate([
      {
        $match: {
          school: session.user.school,
          role: UserRole.STUDENT,
        },
      },
      {
        $group: {
          _id: { class: '$class', section: '$section' },
          studentCount: { $sum: 1 },
          students: { $push: '$_id' },
        },
      },
      {
        $project: {
          _id: 0,
          class: '$_id.class',
          section: '$_id.section',
          studentCount: 1,
        },
      },
      {
        $sort: { class: 1, section: 1 },
      },
    ]);

    // Get assignments and tests for each class
    const classesWithDetails = await Promise.all(
      classes.map(async (cls) => {
        const assignments = await Assignment.countDocuments({
          school: session.user.school,
          class: cls.class,
          section: cls.section || { $exists: false },
        });

        const tests = await Test.countDocuments({
          school: session.user.school,
          class: cls.class,
          section: cls.section || { $exists: false },
        });

        // TODO: Calculate from submissions
        const avgScore = 84;
        const attendance = '93%';

        return {
          ...cls,
          assignments,
          tests,
          avgScore,
          attendance,
        };
      })
    );

    return NextResponse.json({
      success: true,
      classes: classesWithDetails,
    });
  } catch (error: any) {
    console.error('Get classes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
