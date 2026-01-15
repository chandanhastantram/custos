'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { MessageCircle, Wand2, Sparkles, Send, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIQuestionsPage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(10);

  const generatedQuestions = [
    { q: 'What is the discriminant of a quadratic equation ax² + bx + c = 0?', type: 'MCQ', options: ['b² - 4ac', 'b² + 4ac', '2a', '-b/2a'] },
    { q: 'If the discriminant is negative, the roots are:', type: 'MCQ', options: ['Real and equal', 'Real and distinct', 'Complex', 'Zero'] },
    { q: 'Solve: x² - 5x + 6 = 0', type: 'Short Answer', answer: 'x = 2 or x = 3' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <MessageCircle className="w-7 h-7" />
            AI Question Generator
          </h2>
          <p className="text-muted-foreground">Generate questions from any topic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Topic / Chapter</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Quadratic Equations, Photosynthesis"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question Type</label>
              <div className="flex gap-2 flex-wrap">
                {['mcq', 'short', 'theory', 'mixed'].map(type => (
                  <button
                    key={type}
                    onClick={() => setQuestionType(type)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      questionType === type ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {type === 'mcq' ? 'MCQ' : type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      difficulty === d ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Questions: {count}</label>
              <input
                type="range"
                min="5"
                max="30"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90">
              <Sparkles className="w-5 h-5" />
              Generate Questions
            </button>
          </div>
        </div>

        {/* Generated Questions */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Questions</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {generatedQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">{q.type}</span>
                    <span className="text-sm font-medium">Q{i + 1}</span>
                  </div>
                  <p className="mb-2">{q.q}</p>
                  {q.options && (
                    <div className="space-y-1 ml-4">
                      {q.options.map((opt, j) => (
                        <p key={j} className="text-sm text-muted-foreground">{String.fromCharCode(65 + j)}. {opt}</p>
                      ))}
                    </div>
                  )}
                  {q.answer && (
                    <p className="text-sm text-green-400 mt-2">Answer: {q.answer}</p>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm">
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
