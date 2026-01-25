'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ClipboardList, CheckCircle, Clock, BookOpen, Star, Calendar, Loader2, RefreshCw, FileText, Play } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
  submission?: any;
}

interface Test {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questionCount: number;
  scheduledDate?: string;
  isUpcoming: boolean;
  isCompleted: boolean;
  submission?: any;
}

export default function DailyWorkPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch work
  const fetchWork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch assignments and tests in parallel
      const [assignmentsRes, testsRes] = await Promise.all([
        fetch('/api/student/assignments'),
        fetch('/api/student/tests'),
      ]);
      
      const assignmentsData = await assignmentsRes.json();
      const testsData = await testsRes.json();
      
      if (assignmentsRes.ok) {
        setAssignments(assignmentsData.assignments || []);
      }
      
      if (testsRes.ok) {
        setTests(testsData.tests || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  // Calculate pending and completed
  const now = new Date();
  
  const pendingAssignments = assignments.filter(a => 
    new Date(a.dueDate) >= now && !a.submission
  );
  
  const completedAssignments = assignments.filter(a => a.submission);
  
  const pendingTests = tests.filter(t => !t.isCompleted);
  const completedTests = tests.filter(t => t.isCompleted);

  const pendingWork = [
    ...pendingAssignments.map(a => ({
      id: a._id,
      type: 'assignment' as const,
      subject: a.subject,
      title: a.title,
      itemType: 'Assignment',
      dueDate: a.dueDate,
      points: a.totalMarks,
    })),
    ...pendingTests.map(t => ({
      id: t._id,
      type: 'test' as const,
      subject: t.subject,
      title: t.title,
      itemType: `Test • ${t.questionCount} questions • ${t.duration} min`,
      dueDate: t.scheduledDate || '',
      points: t.totalMarks,
    })),
  ];

  const completedWork = [
    ...completedAssignments.map(a => ({
      id: a._id,
      type: 'assignment' as const,
      subject: a.subject,
      title: a.title,
      score: a.submission?.marksObtained ? `${a.submission.marksObtained}/${a.totalMarks}` : 'Submitted',
      points: a.submission?.marksObtained || 0,
      date: new Date(a.submission?.submittedAt).toLocaleDateString(),
    })),
    ...completedTests.map(t => ({
      id: t._id,
      type: 'test' as const,
      subject: t.subject,
      title: t.title,
      score: t.submission?.marksObtained ? `${t.submission.marksObtained}/${t.totalMarks}` : 'Submitted',
      points: t.submission?.marksObtained || 0,
      date: t.submission?.submittedAt ? new Date(t.submission.submittedAt).toLocaleDateString() : 'Completed',
    })),
  ];

  const totalPoints = completedWork.reduce((sum, w) => sum + w.points, 0);

  // Time until due
  const getTimeUntil = (dateStr: string) => {
    if (!dateStr) return 'Anytime';
    const diff = new Date(dateStr).getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 1) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return 'Due soon!';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Work</h2>
          <p className="text-muted-foreground">Complete your assignments and earn points</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchWork}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
            <Star className="w-5 h-5" />
            <span className="font-semibold">{totalPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'pending', label: 'Pending', count: pendingWork.length },
          { id: 'completed', label: 'Completed', count: completedWork.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} <span className="text-xs ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      {!loading && activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingWork.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <p className="text-muted-foreground">All caught up! No pending work</p>
            </div>
          ) : (
            pendingWork.map((work) => (
              <div key={work.id} className="relative rounded-xl border border-border p-1">
                <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
                <div className="relative bg-card rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      work.type === 'test' ? 'bg-blue-600/20 text-blue-500' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {work.type === 'test' ? <FileText className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{work.title}</h3>
                          <p className="text-muted-foreground text-sm">{work.subject} • {work.itemType}</p>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span className="font-medium">+{work.points}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-orange-400">
                          <Clock className="w-4 h-4" />
                          Due in {getTimeUntil(work.dueDate)}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (work.type === 'test') {
                          alert(`Starting test: ${work.title}\n\nThis would open the test-taking interface.`);
                        } else {
                          alert(`Starting assignment: ${work.title}\n\nThis would open the assignment submission interface.`);
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : !loading && (
        <div className="space-y-4">
          {completedWork.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No completed work yet</p>
            </div>
          ) : (
            completedWork.map((work) => (
              <div key={work.id} className="relative rounded-xl border border-border p-1">
                <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
                <div className="relative bg-card rounded-lg p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{work.title}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {work.date} • {work.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{work.score}</p>
                      <p className="text-sm text-yellow-400">+{work.points} points</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
