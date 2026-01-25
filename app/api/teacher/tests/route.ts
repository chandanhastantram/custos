import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateAdaptiveQuestions, generateDailyHomework } from '@/lib/ai';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import { UserRole, TestType } from '@/types/enums';

// POST - Generate AI questions for test
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Only teachers can generate questions
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: 'Only teachers can generate questions' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      title,
      subject,
      class: className,
      section,
      weakTopics,
      strongTopics,
      questionCount,
      duration,
      scheduledDate,
      testType,
    } = body;

    // Validate required fields
    if (!title || !subject || !className || !weakTopics || !strongTopics || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate questions with AI
    const questions = await generateAdaptiveQuestions(
      weakTopics,
      strongTopics,
      subject,
      testType || TestType.DAILY,
      questionCount
    );

    // Calculate total marks
    const totalMarks = questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0);

    // Create test in database
    const test = await Test.create({
      school: session.user.school,
      title,
      subject,
      class: className,
      section,
      teacher: session.user.id,
      questions: questions.map((q: any) => ({
        questionText: q.questionText,
        type: q.type === 'MCQ' ? 'MCQ' : 'Theory',
        topic: q.topic,
        subTopic: q.subTopic,
        difficulty: q.difficulty,
        bloomsLevel: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
        isAIGenerated: true,
      })),
      totalMarks,
      duration: duration || 45,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      testType: testType || TestType.DAILY,
      isAIGenerated: true,
      aiMetadata: {
        weakTopics,
        strongTopics,
        distribution: {
          weak: Math.ceil(questionCount * 0.6),
          strong: Math.floor(questionCount * 0.4),
        },
      },
      isPublished: false,
    });

    return NextResponse.json({
      success: true,
      test,
      message: `Successfully generated ${questions.length} questions with AI`,
    });
  } catch (error: any) {
    console.error('AI question generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

// GET - List all tests for teacher
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const subject = searchParams.get('subject');

    const query: any = {
      school: session.user.school,
      teacher: session.user.id,
    };

    if (className) query.class = className;
    if (subject) query.subject = subject;

    const tests = await Test.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      tests,
    });
  } catch (error: any) {
    console.error('Get tests error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
