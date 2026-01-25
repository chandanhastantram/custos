
import { NextRequest, NextResponse } from 'next/server';
import { adminChatbot } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await adminChatbot(message, context);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Admin chatbot API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}
