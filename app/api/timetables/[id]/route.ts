import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Timetable from '@/models/Timetable';
import TimetableEntry from '@/models/TimetableEntry';

export const runtime = 'nodejs';

// GET - Fetch single timetable by ID with entries
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const timetable = await Timetable.findById(id)
      .populate('class', 'name sections')
      .populate('school', 'name')
      .populate('createdBy', 'name email');

    if (!timetable) {
      return NextResponse.json(
        { success: false, error: 'Timetable not found' },
        { status: 404 }
      );
    }

    // Fetch all entries for this timetable
    const entries = await TimetableEntry.find({ timetable: id })
      .populate('subject', 'name')
      .populate('teacher', 'name email')
      .sort({ day: 1, periodNumber: 1 });

    return NextResponse.json({
      success: true,
      data: {
        ...timetable.toObject(),
        entries,
      },
    });
  } catch (error: any) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update timetable metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const { name, section, isActive } = body;

    const timetable = await Timetable.findByIdAndUpdate(
      id,
      { name, section, isActive },
      { new: true, runValidators: true }
    )
      .populate('class', 'name sections')
      .populate('school', 'name')
      .populate('createdBy', 'name email');

    if (!timetable) {
      return NextResponse.json(
        { success: false, error: 'Timetable not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable,
    });
  } catch (error: any) {
    console.error('Error updating timetable:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete timetable and all its entries
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const timetable = await Timetable.findById(id);

    if (!timetable) {
      return NextResponse.json(
        { success: false, error: 'Timetable not found' },
        { status: 404 }
      );
    }

    // Delete all entries associated with this timetable
    await TimetableEntry.deleteMany({ timetable: id });

    // Delete the timetable
    await Timetable.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Timetable and all entries deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting timetable:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
