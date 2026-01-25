
import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, subject, count, difficulty } = body;

    if (!topic || !subject) {
      return NextResponse.json(
        { success: false, error: 'Topic and subject are required' },
        { status: 400 }
      );
    }

    const result = await generateFlashcards(
      topic,
      subject,
      count || 10,
      difficulty || 'medium'
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
