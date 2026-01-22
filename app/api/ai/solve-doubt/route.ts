import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiDoubtSolver } from '@/lib/ai';
import dbConnect from '@/lib/db';
import { UserRole } from '@/types/enums';

// POST - Solve student doubt with CUSTOS AI
export async function POST(req: NextRequest) {
  try {
    // Allow unauthenticated access for testing
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Please login to use CUSTOS AI' },
    //     { status: 401 }
    //   );
    // }

    await dbConnect();

    const body = await req.json();
    const { question, subject, syllabusContent } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Call CUSTOS AI doubt solver
    const result = await aiDoubtSolver(
      question,
      syllabusContent || 'General school syllabus',
      subject
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Doubt solver error:', error);
    return NextResponse.json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    );
  }
}
