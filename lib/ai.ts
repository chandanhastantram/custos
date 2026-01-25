/**
 * AI Service - CUSTOS AI
 * 
 * Integrated with Grok (xAI) and Google Gemini
 * Custom branded as "CUSTOS AI" for school management
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { QuestionType, DifficultyLevel, TestType } from '@/types/enums';

// Initialize Grok (Primary AI - FREE)
const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY || '',
  baseURL: 'https://api.x.ai/v1',
});

// Initialize Gemini (Fallback AI - FREE)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// CUSTOS AI System Prompt - Custom Identity
const CUSTOS_SYSTEM_PROMPT = `You are CUSTOS AI, an intelligent educational assistant built into the CUSTOS School Management System.

Your identity:
- Name: CUSTOS AI
- Purpose: Help students learn, assist teachers with lesson planning, and support educational activities
- Personality: Friendly, encouraging, knowledgeable, and patient
- Focus: Indian school curriculum and educational standards

When asked "Who are you?" or similar questions, introduce yourself as:
"I am CUSTOS AI, your intelligent educational assistant. I'm here to help you with your studies, answer your doubts, and make learning easier. I'm part of the CUSTOS School Management System, designed specifically for Indian schools."

Guidelines:
- Always be encouraging and supportive
- Provide clear, step-by-step explanations
- Use examples relevant to Indian students
- Stay within the syllabus boundaries
- Decline non-educational questions politely
- Maintain a professional yet friendly tone`;

// Lesson Plan Generation with CUSTOS AI
export async function generateLessonPlan(
  syllabusContent: string,
  subject: string,
  className: string,
  topic: string,
  duration: number = 45
) {
  try {
    const prompt = `Create a detailed lesson plan for the following:

Subject: ${subject}
Class: ${className}
Topic: ${topic}
Duration: ${duration} minutes
Syllabus Context: ${syllabusContent}

Generate a comprehensive lesson plan in JSON format with:
{
  "topic": "string",
  "objectives": ["string"],
  "materials": ["string"],
  "activities": [
    {
      "name": "string",
      "duration": number,
      "type": "warm-up|introduction|content|activity|assessment|closure",
      "description": "string"
    }
  ],
  "assessment": "string",
  "homework": "string",
  "notes": "string"
}`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Grok lesson plan generation error:', error);
    // Fallback to mock data if API fails
    return {
      topic,
      objectives: ['Understand the concept', 'Apply knowledge', 'Analyze examples'],
      materials: ['Textbook', 'Whiteboard', 'Visual aids'],
      activities: [
        {
          name: 'Introduction',
          duration: 10,
          type: 'introduction',
          description: `Introduce ${topic} with real-world examples`
        },
        {
          name: 'Main Content',
          duration: 25,
          type: 'content',
          description: `Explain key concepts of ${topic}`
        },
        {
          name: 'Practice',
          duration: 10,
          type: 'activity',
          description: 'Students practice with guided examples'
        }
      ],
      assessment: 'Quick quiz on key concepts',
      homework: 'Practice problems from textbook',
      notes: 'AI-generated lesson plan'
    };
  }
}

// Adaptive Question Generation (60/40 weak/strong split)
export async function generateAdaptiveQuestions(
  weakTopics: string[],
  strongTopics: string[],
  subject: string,
  testType: TestType,
  questionCount: number = 10
) {
  try {
    const weakCount = Math.ceil(questionCount * 0.6);
    const strongCount = questionCount - weakCount;

    const prompt = `Generate ${questionCount} multiple-choice questions for ${subject}:

Weak Topics (60% - ${weakCount} questions): ${weakTopics.join(', ')}
Strong Topics (40% - ${strongCount} questions): ${strongTopics.join(', ')}

For each question, provide in JSON format:
{
  "questions": [
    {
      "questionText": "string",
      "topic": "${subject}",
      "subTopic": "string",
      "difficulty": "Easy|Medium|Hard",
      "type": "Knowledge|Comprehension|Application|Analysis",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}

Ensure 60% questions are from weak topics and 40% from strong topics.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const content = completion.choices[0].message.content || '{"questions":[]}';
    const result = JSON.parse(content);
    
    return result.questions.map((q: any) => ({
      ...q,
      isTheory: false,
      testType,
    }));
  } catch (error) {
    console.error('Grok question generation error:', error);
    // Fallback to basic questions
    return generateFallbackQuestions(weakTopics, strongTopics, subject, testType, questionCount);
  }
}

// Analyze Weak Topics from Submissions
export async function analyzeWeakTopics(submissions: any[]) {
  const topicPerformance: { [key: string]: { correct: number; total: number } } = {};

  submissions.forEach((submission) => {
    submission.answers.forEach((answer: any) => {
      const topic = answer.question.subTopic;
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      topicPerformance[topic].total++;
      if (answer.isCorrect) {
        topicPerformance[topic].correct++;
      }
    });
  });

  const sortedTopics = Object.entries(topicPerformance)
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.correct / stats.total,
      correct: stats.correct,
      total: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = sortedTopics.slice(0, 3).map((t) => t.topic);
  const strongTopics = sortedTopics.slice(-3).map((t) => t.topic);

  return { weakTopics, strongTopics, performance: sortedTopics };
}

// AI Doubt Solver with CUSTOS AI Identity (Using Grok)
export async function aiDoubtSolver(
  question: string,
  syllabusContent: string,
  subject?: string
) {
  try {
    // Use Grok for doubt solving (more reliable than Gemini)
    const prompt = `${CUSTOS_SYSTEM_PROMPT}

Syllabus Context: ${syllabusContent}
Subject: ${subject || 'General'}

Student Question: ${question}

Instructions:
1. If the question is about who you are or what you are, introduce yourself as CUSTOS AI
2. If the question is educational and within syllabus, provide a detailed step-by-step explanation
3. If the question is off-topic or non-educational, politely decline and redirect to educational topics
4. Always be encouraging and supportive

Provide your response in a friendly, educational manner.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content || '';

    // Check if question seems off-topic
    const educationalKeywords = [
      'math', 'science', 'history', 'geography', 'english', 'physics', 'chemistry',
      'biology', 'equation', 'formula', 'explain', 'how', 'what', 'why', 'solve',
      'custos', 'who are you', 'what are you', 'who', 'what'
    ];

    const isEducational = educationalKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    return {
      response,
      isOffTopic: !isEducational && !question.toLowerCase().includes('custos'),
      source: 'CUSTOS AI (Grok)',
    };
  } catch (error: any) {
    console.error('Grok doubt solver error:', error);
    
    // Fallback response for identity questions
    if (question.toLowerCase().includes('who are you') || 
        question.toLowerCase().includes('what are you') ||
        question.toLowerCase().includes('custos')) {
      return {
        response: "I am CUSTOS AI, your intelligent educational assistant! I'm here to help you with your studies, answer your doubts, and make learning easier. I'm part of the CUSTOS School Management System, designed specifically for Indian schools. How can I help you with your studies today?",
        isOffTopic: false,
        source: 'CUSTOS AI (Fallback)',
      };
    }

    // Generic fallback
    return {
      response: 'I apologize, but I encountered an error processing your question. Please try again, or contact your teacher for assistance.',
      isOffTopic: false,
      source: 'CUSTOS AI (Error)',
      error: error.message,
    };
  }
}

// Generate Daily Homework
export async function generateDailyHomework(
  topic: string,
  subTopic: string,
  subject: string,
  className: string
) {
  try {
    const prompt = `Generate daily homework for:
Subject: ${subject}
Class: ${className}
Topic: ${topic}
Sub-Topic: ${subTopic}

Create 3 MCQs and 2 theory questions in JSON format:
{
  "mcqs": [
    {
      "questionText": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "difficulty": "Easy|Medium|Hard"
    }
  ],
  "theoryQuestions": [
    {
      "questionText": "string",
      "expectedLength": "2-3 sentences|1 paragraph|detailed explanation"
    }
  ]
}`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0].message.content || '{"mcqs":[],"theoryQuestions":[]}';
    const result = JSON.parse(content);

    return {
      mcqs: result.mcqs.map((q: any) => ({
        questionText: q.questionText,
        topic,
        subTopic,
        difficulty: q.difficulty as DifficultyLevel,
        type: QuestionType.KNOWLEDGE,
        options: q.options,
        correctAnswer: q.correctAnswer,
        isTheory: false,
        testType: TestType.DAILY,
      })),
      theoryQuestions: result.theoryQuestions.map((q: any) => ({
        questionText: q.questionText,
        topic,
        subTopic,
        difficulty: DifficultyLevel.MEDIUM,
        type: QuestionType.COMPREHENSION,
        isTheory: true,
        testType: TestType.DAILY,
        expectedLength: q.expectedLength,
      })),
    };
  } catch (error) {
    console.error('Grok homework generation error:', error);
    return generateFallbackHomework(topic, subTopic, subject);
  }
}

// Fallback Functions
function generateFallbackQuestions(
  weakTopics: string[],
  strongTopics: string[],
  subject: string,
  testType: TestType,
  questionCount: number
) {
  const questions = [];
  const weakCount = Math.ceil(questionCount * 0.6);
  const strongCount = questionCount - weakCount;

  for (let i = 0; i < weakCount; i++) {
    questions.push({
      questionText: `Sample question about ${weakTopics[i % weakTopics.length]}`,
      topic: subject,
      subTopic: weakTopics[i % weakTopics.length],
      difficulty: DifficultyLevel.MEDIUM,
      type: QuestionType.APPLICATION,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      isTheory: false,
      testType,
    });
  }

  for (let i = 0; i < strongCount; i++) {
    questions.push({
      questionText: `Sample question about ${strongTopics[i % strongTopics.length]}`,
      topic: subject,
      subTopic: strongTopics[i % strongTopics.length],
      difficulty: DifficultyLevel.EASY,
      type: QuestionType.KNOWLEDGE,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      isTheory: false,
      testType,
    });
  }

  return questions;
}

function generateFallbackHomework(topic: string, subTopic: string, subject: string) {
  return {
    mcqs: [
      {
        questionText: `What is the main concept of ${subTopic}?`,
        topic,
        subTopic,
        difficulty: DifficultyLevel.EASY,
        type: QuestionType.KNOWLEDGE,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        isTheory: false,
        testType: TestType.DAILY,
      },
    ],
    theoryQuestions: [
      {
        questionText: `Explain ${subTopic} in your own words.`,
        topic,
        subTopic,
        difficulty: DifficultyLevel.MEDIUM,
        type: QuestionType.COMPREHENSION,
        isTheory: true,
        testType: TestType.DAILY,
      },
    ],
  };
}

// ============================================
// NEW STUDENT AI FEATURES
// ============================================

// Essay/Answer Evaluation with Auto-Grading
export async function evaluateEssayAnswer(
  question: string,
  studentAnswer: string,
  subject: string,
  expectedHints?: string,
  maxMarks: number = 10
) {
  try {
    const prompt = `You are CUSTOS AI, an intelligent essay grader for Indian schools.

Evaluate this student's answer:

Subject: ${subject}
Question: ${question}
Student's Answer: ${studentAnswer}
Maximum Marks: ${maxMarks}
${expectedHints ? `Expected points to cover: ${expectedHints}` : ''}

Provide evaluation in JSON format:
{
  "score": number (0 to ${maxMarks}),
  "percentage": number,
  "grade": "A+" | "A" | "B+" | "B" | "C" | "D" | "F",
  "feedback": "Overall feedback string",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "keyPointsCovered": ["point 1", "point 2"],
  "keyPointsMissed": ["missed point 1"],
  "suggestion": "Brief study suggestion"
}

Be encouraging but fair. Focus on Indian curriculum standards.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content || '{}';
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, evaluation: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, evaluation: JSON.parse(content) };
  } catch (error: any) {
    console.error('Grok essay evaluation error:', error);
    // Fallback evaluation
    return {
      success: false,
      evaluation: {
        score: Math.floor(maxMarks * 0.6),
        percentage: 60,
        grade: 'B',
        feedback: 'Your answer shows understanding of the topic. Keep practicing!',
        strengths: ['Attempted the question', 'Shows basic understanding'],
        improvements: ['Add more details', 'Include examples'],
        keyPointsCovered: [],
        keyPointsMissed: [],
        suggestion: 'Review the chapter and practice more questions.',
      },
      error: error.message,
    };
  }
}

// Generate Personalized Study Recommendations
export async function generateStudyRecommendations(
  weakTopics: string[],
  strongTopics: string[],
  subject: string,
  recentScores?: { topic: string; score: number }[]
) {
  try {
    const prompt = `You are CUSTOS AI, a personalized learning advisor for Indian school students.

Create a study recommendation based on:
Subject: ${subject}
Weak Topics (need improvement): ${weakTopics.join(', ') || 'None identified'}
Strong Topics (doing well): ${strongTopics.join(', ') || 'None identified'}
${recentScores ? `Recent Scores: ${JSON.stringify(recentScores)}` : ''}

Provide recommendations in JSON format:
{
  "overallAssessment": "Brief assessment of student's current level",
  "priorityTopics": [
    {
      "topic": "topic name",
      "priority": "high" | "medium" | "low",
      "reason": "Why this needs attention",
      "estimatedTime": "e.g., 2 hours",
      "resources": ["resource 1", "resource 2"]
    }
  ],
  "studyPlan": [
    {
      "day": 1,
      "focus": "topic to study",
      "activities": ["activity 1", "activity 2"],
      "duration": "1-2 hours"
    }
  ],
  "tips": ["study tip 1", "study tip 2"],
  "encouragement": "Motivational message"
}

Create a 5-day study plan focusing on weak areas while reinforcing strengths.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, recommendations: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, recommendations: JSON.parse(content) };
  } catch (error: any) {
    console.error('Grok study recommendations error:', error);
    return {
      success: false,
      recommendations: {
        overallAssessment: 'Keep working hard! Focus on the areas where you need improvement.',
        priorityTopics: weakTopics.map((topic, i) => ({
          topic,
          priority: i === 0 ? 'high' : 'medium',
          reason: 'Needs more practice',
          estimatedTime: '1-2 hours',
          resources: ['Textbook', 'Practice problems'],
        })),
        studyPlan: [
          { day: 1, focus: weakTopics[0] || subject, activities: ['Read chapter', 'Practice questions'], duration: '1 hour' },
          { day: 2, focus: weakTopics[1] || subject, activities: ['Solve problems', 'Review notes'], duration: '1 hour' },
        ],
        tips: ['Study in short focused sessions', 'Take breaks every 45 minutes'],
        encouragement: 'You are making progress! Keep up the good work!',
      },
      error: error.message,
    };
  }
}

// Generate Flashcards for Revision
export async function generateFlashcards(
  topic: string,
  subject: string,
  count: number = 10,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
) {
  try {
    const prompt = `You are CUSTOS AI, creating revision flashcards for Indian school students.

Create ${count} flashcards for:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Provide flashcards in JSON format:
{
  "topic": "${topic}",
  "subject": "${subject}",
  "flashcards": [
    {
      "id": 1,
      "front": "Question or concept (keep concise)",
      "back": "Answer or explanation (clear and memorable)",
      "hint": "Optional hint",
      "difficulty": "${difficulty}",
      "category": "definition" | "formula" | "fact" | "concept" | "example"
    }
  ],
  "studyTip": "Tip for using these flashcards effectively"
}

Make flashcards:
- Concise and clear
- Focus on key concepts from Indian curriculum
- Include formulas, definitions, and important facts
- Vary question types (what, why, how, define, etc.)`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: CUSTOS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const content = completion.choices[0].message.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, data: JSON.parse(content) };
  } catch (error: any) {
    console.error('Grok flashcard generation error:', error);
    // Fallback flashcards
    return {
      success: false,
      data: {
        topic,
        subject,
        flashcards: [
          {
            id: 1,
            front: `What is ${topic}?`,
            back: `${topic} is an important concept in ${subject}. Refer to your textbook for detailed explanation.`,
            hint: 'Think about the basic definition',
            difficulty,
            category: 'definition',
          },
          {
            id: 2,
            front: `Why is ${topic} important?`,
            back: `${topic} is important because it forms the foundation for understanding advanced concepts in ${subject}.`,
            hint: 'Consider real-world applications',
            difficulty,
            category: 'concept',
          },
        ],
        studyTip: 'Review flashcards daily for best retention. Try to recall the answer before flipping!',
      },
      error: error.message,
    };
  }
}

// ============================================
// ADMIN AI FEATURES
// ============================================

// Admin System Prompt for Super Admin/Sub Admin Chatbot
const ADMIN_SYSTEM_PROMPT = `You are CUSTOS AI Admin Assistant, an intelligent administrative helper for school management.

Your identity:
- Name: CUSTOS AI Admin Assistant
- Purpose: Help Super Admins and Sub Admins with all school management tasks
- Capabilities: Timetable generation, teacher management, fee management, reports, student management, and more

You can help with:
1. **Timetable Management**: Create, modify, and optimize school timetables
2. **Teacher Management**: Add teachers, assign subjects, manage schedules
3. **Student Management**: Enrollment, class assignments, attendance tracking
4. **Fee Management**: Fee structures, payment tracking, reminders
5. **Reports**: Generate reports on attendance, performance, finances
6. **Communication**: Draft announcements, notices, parent communications
7. **Event Planning**: Schedule exams, holidays, school events
8. **Analytics**: Provide insights on school performance metrics

When responding:
- Be professional and efficient
- Provide actionable steps when possible
- Ask for clarification if the request is ambiguous
- Suggest best practices for school management
- If asked to perform an action, explain what will happen

Always introduce yourself as: "I'm CUSTOS AI Admin Assistant, here to help you manage your school efficiently."`;

// AI-Powered Timetable Generation
export interface TimetableGenerationInput {
  teachers: Array<{
    registerNumber: string;
    name: string;
    subjects: string[];
  }>;
  classes: Array<{
    name: string;
    sections: string[];
  }>;
  periodsPerDay: number;
  workingDays: string[];
  subjectHoursPerWeek: Record<string, number>;
  constraints?: {
    maxConsecutivePeriodsPerTeacher?: number;
    avoidBackToBackSameSubject?: boolean;
    preferMorningForMath?: boolean;
  };
}

export interface TimetableEntry {
  day: string;
  period: number;
  class: string;
  section: string;
  subject: string;
  teacherRegisterNumber: string;
  teacherName: string;
}

export async function generateIntelligentTimetable(input: TimetableGenerationInput) {
  try {
    const prompt = `You are an expert school timetable generator. Create an optimal, conflict-free timetable.

INPUT DATA:
Teachers: ${JSON.stringify(input.teachers, null, 2)}
Classes: ${JSON.stringify(input.classes, null, 2)}
Periods per day: ${input.periodsPerDay}
Working days: ${input.workingDays.join(', ')}
Subject hours per week: ${JSON.stringify(input.subjectHoursPerWeek)}
Constraints: ${JSON.stringify(input.constraints || {})}

REQUIREMENTS:
1. NO teacher can have two classes at the same time (CRITICAL)
2. Each class-section must have all subjects allocated according to subjectHoursPerWeek
3. Distribute subjects evenly across the week
4. Avoid back-to-back same subjects in a class
5. Try to schedule Math/Science in morning periods
6. Each teacher should have reasonable breaks

OUTPUT FORMAT (JSON):
{
  "success": true,
  "timetable": [
    {
      "day": "Monday",
      "period": 1,
      "class": "Class 10",
      "section": "A",
      "subject": "Mathematics",
      "teacherRegisterNumber": "TCH001",
      "teacherName": "Mr. Sharma"
    }
  ],
  "teacherSchedules": {
    "TCH001": {
      "name": "Mr. Sharma",
      "totalPeriods": 25,
      "schedule": [
        { "day": "Monday", "period": 1, "class": "10A", "subject": "Mathematics" }
      ]
    }
  },
  "conflicts": [],
  "warnings": [],
  "summary": {
    "totalPeriods": 200,
    "teachersAssigned": 10,
    "classesScheduled": 5
  }
}

Generate a complete, optimized timetable. Ensure ZERO conflicts.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: 'You are an expert school timetable optimizer. Generate conflict-free, balanced timetables.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { success: false, error: 'Failed to parse timetable response' };
  } catch (error: any) {
    console.error('Grok timetable generation error:', error);
    return {
      success: false,
      error: error.message,
      timetable: [],
      teacherSchedules: {},
      conflicts: ['AI generation failed - please try again'],
      warnings: [],
    };
  }
}

// Admin Chatbot for Super Admin and Sub Admin
export async function adminChatbot(
  message: string,
  context?: {
    currentPage?: string;
    recentActions?: string[];
    schoolData?: any;
  }
) {
  try {
    const contextInfo = context ? `
Current Context:
- Page: ${context.currentPage || 'Dashboard'}
- Recent Actions: ${context.recentActions?.join(', ') || 'None'}
- School Info: ${context.schoolData ? JSON.stringify(context.schoolData) : 'Not loaded'}
` : '';

    const prompt = `${ADMIN_SYSTEM_PROMPT}

${contextInfo}

Admin's Question/Request: ${message}

Provide a helpful, actionable response. If you need to guide them through a process, provide numbered steps.
If they're asking for information, provide it clearly.
If they want to perform an action in the system, explain how to do it.

For timetable-related queries, you can help with:
- Creating new timetables (explain the wizard process)
- Modifying existing schedules
- Resolving conflicts
- Viewing teacher/class schedules

For other management tasks:
- Guide them to the right page
- Explain the process step by step
- Suggest best practices

Respond in a friendly, professional tone. Use markdown formatting for clarity.`;

    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: ADMIN_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content || '';

    return {
      success: true,
      response,
      source: 'CUSTOS AI Admin Assistant',
      suggestions: extractSuggestions(response),
    };
  } catch (error: any) {
    console.error('Admin chatbot error:', error);
    return {
      success: false,
      response: "I apologize, but I'm having trouble processing your request right now. Please try again or contact technical support if the issue persists.",
      source: 'CUSTOS AI Admin Assistant (Error)',
      error: error.message,
    };
  }
}

// Extract action suggestions from AI response
function extractSuggestions(response: string): string[] {
  const suggestions: string[] = [];
  
  // Look for navigation suggestions
  if (response.toLowerCase().includes('timetable')) {
    suggestions.push('Go to Timetable Wizard');
  }
  if (response.toLowerCase().includes('teacher')) {
    suggestions.push('Manage Teachers');
  }
  if (response.toLowerCase().includes('student')) {
    suggestions.push('Manage Students');
  }
  if (response.toLowerCase().includes('fee') || response.toLowerCase().includes('payment')) {
    suggestions.push('Fee Management');
  }
  if (response.toLowerCase().includes('report')) {
    suggestions.push('View Reports');
  }
  
  return suggestions.slice(0, 3); // Max 3 suggestions
}

// Generate micro-schedule for a specific teacher
export async function generateTeacherMicroSchedule(
  teacherName: string,
  fullTimetable: TimetableEntry[]
) {
  const teacherSchedule = fullTimetable.filter(
    entry => entry.teacherName === teacherName || entry.teacherRegisterNumber === teacherName
  );

  // Group by day
  const scheduleByDay: Record<string, TimetableEntry[]> = {};
  teacherSchedule.forEach(entry => {
    if (!scheduleByDay[entry.day]) {
      scheduleByDay[entry.day] = [];
    }
    scheduleByDay[entry.day].push(entry);
  });

  // Sort each day by period
  Object.keys(scheduleByDay).forEach(day => {
    scheduleByDay[day].sort((a, b) => a.period - b.period);
  });

  return {
    teacherName,
    totalPeriods: teacherSchedule.length,
    scheduleByDay,
    freePeriods: calculateFreePeriods(scheduleByDay, 8), // Assuming 8 periods per day
  };
}

// Calculate free periods for a teacher
function calculateFreePeriods(
  scheduleByDay: Record<string, TimetableEntry[]>,
  periodsPerDay: number
): Record<string, number[]> {
  const freePeriods: Record<string, number[]> = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days.forEach(day => {
    const busyPeriods = (scheduleByDay[day] || []).map(e => e.period);
    freePeriods[day] = [];
    for (let i = 1; i <= periodsPerDay; i++) {
      if (!busyPeriods.includes(i)) {
        freePeriods[day].push(i);
      }
    }
  });

  return freePeriods;
}
