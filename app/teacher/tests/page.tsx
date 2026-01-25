'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { FileText, Plus, Brain, Sparkles, Calendar, Users, X, Loader2, RefreshCw, Eye, Edit } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Test {
  _id: string;
  title: string;
  subject: string;
  class: string;
  section?: string;
  teacher?: { name: string };
  questions?: any[];
  totalMarks: number;
  duration: number;
  scheduledDate?: string;
  isAIGenerated: boolean;
  isPublished: boolean;
  testType?: string;
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    class: '10A',
    section: '',
    duration: 45,
    scheduledDate: '',
    questionCount: 10,
    weakTopics: ['Quadratic Equations', 'Trigonometry'],
    strongTopics: ['Algebra', 'Geometry'],
  });

  // Fetch tests
  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/teacher/tests');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tests');
      
      setTests(data.tests || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Create test with AI
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      
      const res = await fetch('/api/teacher/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          subject: formData.subject,
          class: formData.class,
          section: formData.section,
          duration: formData.duration,
          scheduledDate: formData.scheduledDate,
          questionCount: formData.questionCount,
          weakTopics: formData.weakTopics,
          strongTopics: formData.strongTopics,
          testType: 'DAILY',
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create test');
      
      // Show generated questions
      if (data.test?.questions) {
        setGeneratedQuestions(data.test.questions);
      }
      
      alert(data.message || 'Test created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        subject: 'Mathematics',
        class: '10A',
        section: '',
        duration: 45,
        scheduledDate: '',
        questionCount: 10,
        weakTopics: ['Quadratic Equations', 'Trigonometry'],
        strongTopics: ['Algebra', 'Geometry'],
      });
      fetchTests();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const getStatus = (test: Test) => {
    if (!test.isPublished) return 'draft';
    if (test.scheduledDate && new Date(test.scheduledDate) > new Date()) return 'scheduled';
    return 'completed';
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
        <div className="flex gap-3">
          <button 
            onClick={fetchTests}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Create Test
          </button>
        </div>
      </div>

      {/* AI Feature Highlight */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
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

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Tests List */}
      {!loading && (
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tests found</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first AI-powered test!</p>
            </div>
          ) : (
            tests.map((test) => {
              const status = getStatus(test);
              return (
                <div key={test._id} className="relative rounded-xl border border-border p-1">
                  <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
                  <div className="relative bg-card rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          {test.isAIGenerated && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600/20 text-blue-500 text-xs">
                              <Brain className="w-3 h-3" />
                              AI Generated
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            status === 'scheduled' 
                              ? 'bg-blue-500/20 text-blue-400'
                              : status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Class {test.class}{test.section ? `-${test.section}` : ''}
                          </span>
                          <span>•</span>
                          <span>{test.subject}</span>
                          {test.scheduledDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(test.scheduledDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{test.questions?.length || 0} questions</span>
                          <span>•</span>
                          <span>{test.duration} min</span>
                          <span>•</span>
                          <span>{test.totalMarks} marks</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => alert(`📝 Test Questions: "${test.title}"\n\n${test.questions?.slice(0, 3).map((q: any, i: number) => `Q${i+1}. ${q.question || 'Question ' + (i+1)}`).join('\n') || 'No questions yet'}\n\n... and ${(test.questions?.length || 0) - 3} more questions`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Questions
                      </button>
                      <button 
                        onClick={() => alert(`📊 Results for "${test.title}"\n\n👥 Total Students: 35\n✅ Completed: 28\n⏳ Pending: 7\n\n📈 Statistics:\n• Average Score: 72%\n• Highest: 95%\n• Lowest: 45%\n• Pass Rate: 85%`)}
                        className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 text-sm transition-colors"
                      >
                        View Results
                      </button>
                      <button 
                        onClick={() => {
                          setFormData({
                            title: test.title,
                            subject: test.subject,
                            class: test.class,
                            section: test.section || '',
                            duration: test.duration,
                            scheduledDate: test.scheduledDate?.split('T')[0] || '',
                            questionCount: test.questions?.length || 10,
                            weakTopics: ['Quadratic Equations', 'Trigonometry'],
                            strongTopics: ['Algebra', 'Geometry'],
                          });
                          setShowCreateModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-4xl w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create New Test with CUSTOS AI</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                    placeholder="Mathematics Quiz - Chapter 4" 
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Class *</label>
                    <select 
                      value={formData.class}
                      onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none"
                    >
                      <option>10A</option>
                      <option>10B</option>
                      <option>9A</option>
                      <option>9B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none"
                    >
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (min) *</label>
                    <input 
                      type="number" 
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                      placeholder="45" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Schedule Date</label>
                    <input 
                      type="date" 
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Questions *</label>
                    <input 
                      type="number" 
                      value={formData.questionCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                      placeholder="10" 
                      min="5"
                      max="50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* AI Configuration */}
              <div className="relative rounded-xl border border-blue-600/30 p-1">
                <div className="relative bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-medium">CUSTOS AI Configuration</p>
                      <p className="text-sm text-muted-foreground">AI will generate {formData.questionCount} questions (60% weak, 40% strong topics)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-orange-400">Weak Topics (60% focus)</label>
                      <input 
                        type="text" 
                        value={formData.weakTopics.join(', ')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          weakTopics: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        }))}
                        className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                        placeholder="Quadratic Equations, Trigonometry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-green-400">Strong Topics (40% focus)</label>
                      <input 
                        type="text" 
                        value={formData.strongTopics.join(', ')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          strongTopics: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        }))}
                        className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none" 
                        placeholder="Algebra, Geometry"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Test with AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
