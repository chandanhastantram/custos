import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TimetableEntry from '@/models/TimetableEntry';

export const runtime = 'nodejs';

// GET - Fetch single entry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const entry = await TimetableEntry.findById(id)
      .populate('subject', 'name')
      .populate('teacher', 'name email')
      .populate('timetable', 'name class section');

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error: any) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a single entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const { day, periodNumber, startTime, endTime, subject, teacher, room, type } = body;

    const entry = await TimetableEntry.findByIdAndUpdate(
      id,
      { day, periodNumber, startTime, endTime, subject, teacher, room, type },
      { new: true, runValidators: true }
    )
      .populate('subject', 'name')
      .populate('teacher', 'name email');

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Entry updated successfully',
      data: entry,
    });
  } catch (error: any) {
    console.error('Error updating entry:', error);
    
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

// DELETE - Delete a single entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const entry = await TimetableEntry.findByIdAndDelete(id);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
