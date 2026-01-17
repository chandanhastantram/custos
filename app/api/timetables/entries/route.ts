import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TimetableEntry from '@/models/TimetableEntry';
import Timetable from '@/models/Timetable';

export const runtime = 'nodejs';

// GET - Fetch entries for a specific timetable
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const timetableId = searchParams.get('timetable');

    if (!timetableId) {
      return NextResponse.json(
        { success: false, error: 'Timetable ID is required' },
        { status: 400 }
      );
    }

    const entries = await TimetableEntry.find({ timetable: timetableId })
      .populate('subject', 'name')
      .populate('teacher', 'name email')
      .sort({ day: 1, periodNumber: 1 });

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error: any) {
    console.error('Error fetching timetable entries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new entry or bulk entries
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { timetable, entries, ...singleEntry } = body;

    // Validate timetable exists
    const timetableExists = await Timetable.findById(timetable);
    if (!timetableExists) {
      return NextResponse.json(
        { success: false, error: 'Timetable not found' },
        { status: 404 }
      );
    }

    // Handle bulk creation
    if (entries && Array.isArray(entries) && entries.length > 0) {
      const entriesWithTimetable = entries.map((entry: any) => ({
        ...entry,
        timetable,
      }));

      const createdEntries = await TimetableEntry.insertMany(entriesWithTimetable);

      return NextResponse.json({
        success: true,
        message: `${createdEntries.length} entries created successfully`,
        data: createdEntries,
      }, { status: 201 });
    }

    // Handle single entry creation
    const { day, periodNumber, startTime, endTime, subject, teacher, room, type } = singleEntry;

    if (!day || !periodNumber || !startTime || !endTime || !subject || !teacher) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: day, periodNumber, startTime, endTime, subject, teacher' },
        { status: 400 }
      );
    }

    const entry = await TimetableEntry.create({
      timetable,
      day,
      periodNumber,
      startTime,
      endTime,
      subject,
      teacher,
      room,
      type: type || 'regular',
    });

    const populatedEntry = await TimetableEntry.findById(entry._id)
      .populate('subject', 'name')
      .populate('teacher', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Entry created successfully',
      data: populatedEntry,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating timetable entry:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'An entry already exists for this day and period' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
