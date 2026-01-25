'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertTriangle, Send, BookOpen } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  type: 'mcq' | 'true-false';
  marks: number;
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
}

// Sample exam data
const sampleExam: ExamData = {
  id: 'exam-001',
  title: 'Mathematics Chapter 5 Test',
  subject: 'Mathematics',
  duration: 30, // 30 minutes
  totalMarks: 40,
  questions: [
    {
      id: 1,
      question: 'What is the value of π (pi) to two decimal places?',
      options: ['3.12', '3.14', '3.16', '3.18'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 2,
      question: 'The sum of angles in a triangle is 180°.',
      options: ['True', 'False'],
      type: 'true-false',
      marks: 4,
    },
    {
      id: 3,
      question: 'What is the square root of 144?',
      options: ['10', '11', '12', '13'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 4,
      question: 'Which of the following is a prime number?',
      options: ['15', '21', '23', '25'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 5,
      question: 'The area of a circle is calculated using the formula πr².',
      options: ['True', 'False'],
      type: 'true-false',
      marks: 4,
    },
    {
      id: 6,
      question: 'What is 15% of 200?',
      options: ['25', '30', '35', '40'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 7,
      question: 'Solve: 2x + 5 = 15. What is the value of x?',
      options: ['3', '4', '5', '6'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 8,
      question: 'A rectangle has 4 equal sides.',
      options: ['True', 'False'],
      type: 'true-false',
      marks: 4,
    },
    {
      id: 9,
      question: 'What is the LCM of 4 and 6?',
      options: ['8', '10', '12', '24'],
      type: 'mcq',
      marks: 4,
    },
    {
      id: 10,
      question: 'The perimeter of a square with side 5cm is 20cm.',
      options: ['True', 'False'],
      type: 'true-false',
      marks: 4,
    },
  ],
};

// Correct answers for validation
const correctAnswers: Record<number, number> = {
  1: 1, // 3.14
  2: 0, // True
  3: 2, // 12
  4: 2, // 23
  5: 0, // True
  6: 1, // 30
  7: 2, // 5
  8: 1, // False
  9: 2, // 12
  10: 0, // True
};

export default function OnlineExamPage() {
  const router = useRouter();
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(sampleExam.duration * 60); // in seconds
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    // Calculate score
    let score = 0;
    sampleExam.questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) {
        score += q.marks;
      }
    });

    const percentage = (score / sampleExam.totalMarks) * 100;

    setResult({ score, total: sampleExam.totalMarks, percentage });
    setSubmitted(true);
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const question = sampleExam.questions[currentQuestion];

  if (!examStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-blue-400" />
              Online Exam
            </h2>
            <p className="text-muted-foreground">Take your scheduled tests online</p>
          </div>
        </div>

        <div className="relative rounded-2xl border border-border p-1 max-w-2xl mx-auto">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{sampleExam.title}</h3>
            <p className="text-muted-foreground mb-6">{sampleExam.subject}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-blue-400">{sampleExam.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-green-400">{sampleExam.duration} min</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-yellow-400">{sampleExam.totalMarks}</p>
                <p className="text-sm text-muted-foreground">Total Marks</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
              <p className="font-medium text-yellow-400 mb-2">⚠️ Instructions:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Do not refresh or close this page during the exam</li>
                <li>• The timer will start as soon as you begin</li>
                <li>• Exam will auto-submit when time runs out</li>
                <li>• You can flag questions to review later</li>
              </ul>
            </div>

            <button
              onClick={() => setExamStarted(true)}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl border border-border p-1 max-w-2xl mx-auto">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.percentage >= 60 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {result.percentage >= 60 ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-red-400" />
              )}
            </div>

            <h3 className="text-2xl font-bold mb-2">Exam Submitted!</h3>
            <p className="text-muted-foreground mb-6">{sampleExam.title}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
                <p className="text-4xl font-bold text-blue-400">{result.score}/{result.total}</p>
                <p className="text-sm text-muted-foreground">Your Score</p>
              </div>
              <div className={`p-6 rounded-xl ${
                result.percentage >= 60 
                  ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30'
                  : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30'
              }`}>
                <p className={`text-4xl font-bold ${result.percentage >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.percentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Percentage</p>
              </div>
            </div>

            <p className={`text-lg font-medium mb-6 ${result.percentage >= 60 ? 'text-green-400' : 'text-orange-400'}`}>
              {result.percentage >= 90 ? '🎉 Excellent! Outstanding performance!' :
               result.percentage >= 75 ? '👏 Great job! Keep it up!' :
               result.percentage >= 60 ? '✅ Good work! You passed!' :
               '📚 Keep studying! You can do better!'}
            </p>

            <button
              onClick={() => router.push('/student/reports')}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Timer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border sticky top-0 z-10">
        <div>
          <h2 className="font-semibold">{sampleExam.title}</h2>
          <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {sampleExam.questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-blue-600/20 text-blue-400'
        }`}>
          <Clock className="w-5 h-5" />
          <span className="text-xl font-bold font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Question Navigator */}
        <div className="md:col-span-1">
          <div className="relative rounded-xl border border-border p-1 sticky top-24">
            <GlowingEffect spread={20} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4">
              <h3 className="font-medium mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {sampleExam.questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                      currentQuestion === i
                        ? 'bg-blue-600 text-white'
                        : answers[q.id] !== undefined
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : flagged.has(q.id)
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
                  <span>Flagged ({flagged.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <span>Not Answered ({sampleExam.questions.length - answeredCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="md:col-span-3">
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-medium">
                    Q{currentQuestion + 1}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-muted text-sm">
                    {question.marks} marks
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(question.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flagged.has(question.id)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-medium mb-6">{question.question}</h3>

              <div className="space-y-3">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(question.id, i)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      answers[question.id] === i
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-medium bg-background/50">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentQuestion === sampleExam.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion((prev) => Math.min(sampleExam.questions.length - 1, prev + 1))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
