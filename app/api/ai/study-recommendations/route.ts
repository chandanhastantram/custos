'use server';

import { NextRequest, NextResponse } from 'next/server';
import { generateStudyRecommendations } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weakTopics, strongTopics, subject, recentScores } = body;

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      );
    }

    const result = await generateStudyRecommendations(
      weakTopics || [],
      strongTopics || [],
      subject,
      recentScores
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Study recommendations API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
