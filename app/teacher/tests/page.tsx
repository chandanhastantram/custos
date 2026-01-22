'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { FileText, Plus, Brain, Sparkles, Calendar, Users, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function TestsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Mock data
  const tests = [
    { id: 1, title: 'Mathematics Quiz - Chapter 4', class: '10A', date: '2026-02-05', questions: 10, duration: 45, isAI: true, status: 'scheduled' },
    { id: 2, title: 'Physics Mid-term', class: '10B', date: '2026-02-10', questions: 20, duration: 90, isAI: false, status: 'scheduled' },
    { id: 3, title: 'Chemistry Test', class: '9A', date: '2026-01-20', questions: 15, duration: 60, isAI: true, status: 'completed' },
  ];

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions([
        {
          questionText: "Solve the quadratic equation: x² + 5x + 6 = 0",
          type: "MCQ",
          topic: "Quadratic Equations",
          difficulty: "Medium",
          options: ["x = -2, -3", "x = 2, 3", "x = -1, -6", "x = 1, 6"],
          correctAnswer: "x = -2, -3",
          marks: 2
        },
        {
          questionText: "What is the discriminant of ax² + bx + c = 0?",
          type: "MCQ",
          topic: "Quadratic Equations",
          difficulty: "Easy",
          options: ["b² - 4ac", "b² + 4ac", "4ac - b²", "a² - 4bc"],
          correctAnswer: "b² - 4ac",
          marks: 1
        },
      ]);
      setGeneratingQuestions(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="w-7 h-7" />
            Tests & Quizzes
          </h2>
          <p className="text-muted-foreground">Create tests with AI-generated questions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Create Test
        </button>
      </div>

      {/* AI Feature Highlight */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">CUSTOS AI Question Generation</h3>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-muted-foreground">Generate adaptive questions with 60% from weak topics and 40% from strong topics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{test.title}</h3>
                    {test.isAI && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                        <Brain className="w-3 h-3" />
                        AI Generated
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      test.status === 'scheduled' 
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {test.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Class {test.class}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {test.date}
                    </span>
                    <span>•</span>
                    <span>{test.questions} questions</span>
                    <span>•</span>
                    <span>{test.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">
                  View Questions
                </button>
                <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm transition-colors">
                  View Results
                </button>
                <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-4xl w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create New Test</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Title</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none" placeholder="Mathematics Quiz - Chapter 4" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Class</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none">
                      <option>10A</option>
                      <option>10B</option>
                      <option>9A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none">
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (min)</label>
                    <input type="number" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none" placeholder="45" />
                  </div>
                </div>
              </div>

              {/* AI Toggle */}
              <div className="relative rounded-xl border border-border p-1">
                <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
                <div className="relative bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="font-medium">Use CUSTOS AI</p>
                        <p className="text-sm text-muted-foreground">Generate questions with AI (60/40 distribution)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseAI(!useAI)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        useAI ? 'bg-purple-500' : 'bg-muted'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                        useAI ? 'translate-x-7' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Question Generation */}
              {useAI && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Weak Topics (60%)</label>
                      <select multiple className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none h-32">
                        <option>Quadratic Equations</option>
                        <option>Trigonometry</option>
                        <option>Probability</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Strong Topics (40%)</label>
                      <select multiple className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none h-32">
                        <option>Algebra</option>
                        <option>Geometry</option>
                        <option>Statistics</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Questions</label>
                    <input type="number" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-purple-500 focus:outline-none" placeholder="10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateQuestions}
                    disabled={generatingQuestions}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {generatingQuestions ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Questions
                      </>
                    )}
                  </button>

                  {/* Generated Questions Preview */}
                  {generatedQuestions.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-medium">Generated Questions ({generatedQuestions.length})</p>
                      {generatedQuestions.map((q, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium">Q{i + 1}. {q.questionText}</p>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">{q.difficulty}</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            {q.options.map((opt: string, j: number) => (
                              <div key={j} className={`p-2 rounded ${opt === q.correctAnswer ? 'bg-green-500/20 text-green-400' : 'bg-muted/50'}`}>
                                {String.fromCharCode(65 + j)}. {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
