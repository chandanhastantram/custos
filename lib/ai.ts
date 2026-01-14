/**
 * AI Service - Placeholder Functions
 * 
 * These functions return mock data for development.
 * Replace with real AI API calls (OpenAI/Gemini) when ready.
 */

import { QuestionType, DifficultyLevel, TestType } from '@/types/enums';

// Lesson Plan Generation
export async function generateLessonPlan(
  syllabusContent: string,
  subject: string,
  className: string
) {
  // TODO: Replace with real AI API call
  return {
    dailyPlan: [
      {
        date: new Date(),
        topic: 'Introduction to Fractions',
        subTopics: [
          {
            name: 'What is a Fraction?',
            duration: 15,
            sections: [
              { type: 'Warm-up', content: 'Quick review of division concepts' },
              { type: 'Introduction', content: 'Define fractions using real-world examples' },
              { type: 'Content', content: 'Explain numerator and denominator' },
              { type: 'Activity', content: 'Students create fractions using paper folding' },
              { type: 'Visual Aids', content: 'Fraction circles and bars' },
            ],
          },
          {
            name: 'Types of Fractions',
            duration: 20,
            sections: [
              { type: 'Content', content: 'Proper, improper, and mixed fractions' },
              { type: 'Activity', content: 'Classify given fractions' },
            ],
          },
        ],
      },
    ],
  };
}

// Adaptive Question Generation (60/40 weak/strong split)
export async function generateAdaptiveQuestions(
  weakTopics: string[],
  strongTopics: string[],
  subject: string,
  testType: TestType,
  questionCount: number = 10
) {
  // TODO: Replace with real AI API call
  const questions = [];
  const weakCount = Math.ceil(questionCount * 0.6);
  const strongCount = questionCount - weakCount;

  // Generate 60% weak topic questions
  for (let i = 0; i < weakCount; i++) {
    questions.push({
      questionText: `Sample question about ${weakTopics[i % weakTopics.length]}`,
      topic: 'Mathematics',
      subTopic: weakTopics[i % weakTopics.length],
      difficulty: DifficultyLevel.MEDIUM,
      type: QuestionType.APPLICATION,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      isTheory: false,
      testType,
    });
  }

  // Generate 40% strong topic questions
  for (let i = 0; i < strongCount; i++) {
    questions.push({
      questionText: `Sample question about ${strongTopics[i % strongTopics.length]}`,
      topic: 'Mathematics',
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

// Analyze Weak Topics from Submissions
export async function analyzeWeakTopics(submissions: any[]) {
  // TODO: Replace with real AI analysis
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

  // Sort topics by performance (lowest first = weakest)
  const sortedTopics = Object.entries(topicPerformance)
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.correct / stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = sortedTopics.slice(0, 3).map((t) => t.topic);
  const strongTopics = sortedTopics.slice(-3).map((t) => t.topic);

  return { weakTopics, strongTopics };
}

// AI Doubt Solver (Syllabus-bound)
export async function aiDoubtSolver(
  question: string,
  syllabusContent: string
) {
  // TODO: Replace with real AI API call with syllabus context
  
  // Simple keyword check for off-topic questions
  const educationalKeywords = [
    'math', 'science', 'history', 'geography', 'english',
    'fraction', 'equation', 'photosynthesis', 'war', 'grammar',
  ];
  
  const isEducational = educationalKeywords.some((keyword) =>
    question.toLowerCase().includes(keyword)
  );

  if (!isEducational) {
    return {
      response: 'I can only help with questions related to your syllabus. Please ask me something about your subjects.',
      isOffTopic: true,
    };
  }

  return {
    response: `Here's a helpful explanation about your question: "${question}". [This is a placeholder response. Real AI will provide detailed, syllabus-specific answers.]`,
    isOffTopic: false,
  };
}

// Generate Daily Homework (MCQs + Theory)
export async function generateDailyHomework(
  topic: string,
  subTopic: string,
  subject: string
) {
  // TODO: Replace with real AI API call
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
