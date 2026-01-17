import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Timetable from '@/models/Timetable';
import TimetableEntry from '@/models/TimetableEntry';

export const runtime = 'nodejs';

// GET - Fetch all timetables with optional filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class');
    const schoolId = searchParams.get('school');
    const isActive = searchParams.get('isActive');

    // Build filter object
    const filter: Record<string, any> = {};
    if (classId) filter.class = classId;
    if (schoolId) filter.school = schoolId;
    if (isActive !== null && isActive !== undefined) filter.isActive = isActive === 'true';

    const timetables = await Timetable.find(filter)
      .populate('class', 'name sections')
      .populate('school', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: timetables,
    });
  } catch (error: any) {
    console.error('Error fetching timetables:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new timetable
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, class: classId, section, school, createdBy, entries } = body;

    // Validate required fields
    if (!name || !classId || !section || !school || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, class, section, school, createdBy' },
        { status: 400 }
      );
    }

    // Create the timetable
    const timetable = await Timetable.create({
      name,
      class: classId,
      section,
      school,
      createdBy,
      isActive: true,
    });

    // If entries are provided, create them bulk
    if (entries && Array.isArray(entries) && entries.length > 0) {
      const entriesWithTimetable = entries.map((entry: any) => ({
        ...entry,
        timetable: timetable._id,
      }));
      await TimetableEntry.insertMany(entriesWithTimetable);
    }

    // Fetch the created timetable with populated fields
    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('class', 'name sections')
      .populate('school', 'name')
      .populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Timetable created successfully',
      data: populatedTimetable,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating timetable:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
