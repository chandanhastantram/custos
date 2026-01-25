
import { NextRequest, NextResponse } from 'next/server';
import { evaluateEssayAnswer } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, studentAnswer, subject, expectedHints, maxMarks } = body;

    if (!question || !studentAnswer) {
      return NextResponse.json(
        { success: false, error: 'Question and student answer are required' },
        { status: 400 }
      );
    }

    const result = await evaluateEssayAnswer(
      question,
      studentAnswer,
      subject || 'General',
      expectedHints,
      maxMarks || 10
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Essay evaluation API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
