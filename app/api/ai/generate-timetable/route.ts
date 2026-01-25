'use server';

import { NextRequest, NextResponse } from 'next/server';
import { generateIntelligentTimetable, TimetableGenerationInput } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body: TimetableGenerationInput = await request.json();

    // Validate required fields
    if (!body.teachers || !body.classes || !body.periodsPerDay || !body.workingDays) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: teachers, classes, periodsPerDay, workingDays' },
        { status: 400 }
      );
    }

    const result = await generateIntelligentTimetable(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Timetable generation API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate timetable' },
      { status: 500 }
    );
  }
}
