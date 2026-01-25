'use client';

import { useRouter } from 'next/navigation';
import GlassIcons from '@/components/ui/glass-icons';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, ClipboardList, MessageCircle, Trophy, Flame, Star, CheckCircle, Brain, Sparkles, BookOpen, Route, FileEdit } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();

  const modules = [
    { icon: <Calendar className="w-6 h-6" />, color: 'blue', label: 'Schedule', href: '/student/schedule' },
    { icon: <ClipboardList className="w-6 h-6" />, color: 'cyan', label: 'Daily Work', href: '/student/daily-work' },
    { icon: <FileEdit className="w-6 h-6" />, color: 'red', label: 'Online Exam', href: '/student/exam' },
    { icon: <Brain className="w-6 h-6" />, color: 'green', label: 'CUSTOS AI', href: '/student/doubt-solver' },
    { icon: <Trophy className="w-6 h-6" />, color: 'orange', label: 'Reports', href: '/student/reports' },
    { icon: <BookOpen className="w-6 h-6" />, color: 'yellow', label: 'Flashcards', href: '/student/flashcards' },
    { icon: <Route className="w-6 h-6" />, color: 'indigo', label: 'Study Path', href: '/student/study-path' },
  ];

  const glassItems = modules.map(m => ({
    ...m,
    onClick: () => router.push(m.href)
  }));

  const gamificationStats = [
    { label: 'Learning Streak', value: '7 days', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: 'Total Points', value: '2,450', icon: <Star className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'Completed', value: '85%', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  const pendingWork = [
    { subject: 'Mathematics', type: 'MCQ Quiz', questions: 10, dueIn: '2 hours' },
    { subject: 'Physics', type: 'Theory Questions', questions: 5, dueIn: '1 day' },
    { subject: 'English', type: 'Essay Writing', questions: 1, dueIn: '2 days' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Student Dashboard</h2>
          <p className="text-muted-foreground">Complete your work, ask questions, and track progress</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-orange-400 flex items-center gap-2">
            <Flame className="w-8 h-8" />
            7
          </p>
          <p className="text-sm text-muted-foreground">Day Streak! 🔥</p>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gamificationStats.map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
        <div className="flex justify-center">
          <GlassIcons items={glassItems} />
        </div>
      </div>

      {/* Pending Work */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Pending Work</h3>
          <div className="space-y-3">
            {pendingWork.map((work, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{work.subject}</p>
                  <p className="text-sm text-muted-foreground">{work.type} • {work.questions} question(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-400">Due in {work.dueIn}</p>
                </div>
                <button 
                  onClick={() => router.push('/student/daily-work')}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOS AI Preview */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white">
              <Brain className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">CUSTOS AI</h3>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-muted-foreground">Got questions? Ask CUSTOS AI anything from your syllabus!</p>
            </div>
            <button 
              onClick={() => router.push('/student/doubt-solver')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Ask Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
