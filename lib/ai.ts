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
