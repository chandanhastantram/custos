import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateLessonPlan } from '@/lib/ai';
import dbConnect from '@/lib/db';
import { UserRole } from '@/types/enums';

// POST - Generate lesson plan with CUSTOS AI
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Only teachers can generate lesson plans
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: 'Only teachers can generate lesson plans' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { subject, className, topic, syllabusContent, duration } = body;

    if (!subject || !className || !topic) {
      return NextResponse.json(
        { error: 'Subject, class, and topic are required' },
        { status: 400 }
      );
    }

    // Generate lesson plan with CUSTOS AI
    const lessonPlan = await generateLessonPlan(
      syllabusContent || 'Standard curriculum',
      subject,
      className,
      topic,
      duration || 45
    );

    return NextResponse.json({
      success: true,
      lessonPlan,
      generatedBy: 'CUSTOS AI',
    });
  } catch (error) {
    console.error('Lesson plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson plan. Please try again.' },
      { status: 500 }
    );
  }
}
