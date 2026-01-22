'use client';

import { useRouter } from 'next/navigation';
import GlassIcons from '@/components/ui/glass-icons';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, FileText, ClipboardList, BarChart3, Brain, Users, School, CheckCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const router = useRouter();

  const modules = [
    { icon: <Users className="w-6 h-6" />, color: 'blue', label: 'Students', href: '/teacher/students' },
    { icon: <School className="w-6 h-6" />, color: 'purple', label: 'Classes', href: '/teacher/classes' },
    { icon: <ClipboardList className="w-6 h-6" />, color: 'green', label: 'Assignments', href: '/teacher/assignments' },
    { icon: <FileText className="w-6 h-6" />, color: 'pink', label: 'Tests', href: '/teacher/tests' },
    { icon: <CheckCircle className="w-6 h-6" />, color: 'orange', label: 'Grading', href: '/teacher/grading' },
    { icon: <Brain className="w-6 h-6" />, color: 'indigo', label: 'Lesson Plan', href: '/teacher/lesson-plan' },
  ];

  const glassItems = modules.map(m => ({
    ...m,
    onClick: () => router.push(m.href)
  }));

  const todaysClasses = [
    { time: '09:00 AM', subject: 'Mathematics', class: 'Class 10A', room: 'Room 101' },
    { time: '10:30 AM', subject: 'Physics', class: 'Class 11B', room: 'Lab 3' },
    { time: '01:00 PM', subject: 'Mathematics', class: 'Class 9A', room: 'Room 102' },
    { time: '02:30 PM', subject: 'Physics', class: 'Class 10B', room: 'Lab 2' },
  ];

  const pendingWork = [
    { type: 'Corrections', count: 15, subject: 'Math Worksheet' },
    { type: 'Tests', count: 3, subject: 'Weekly Quiz' },
    { type: 'Feedback', count: 8, subject: 'Student Reports' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Teacher Dashboard</h2>
        <p className="text-muted-foreground">Plan lessons, manage work, and track student progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingWork.map((item, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{item.type}</p>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.subject}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                <ClipboardList className="w-5 h-5" />
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

      {/* Today's Schedule */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {todaysClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium">{cls.time}</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex-1">
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground">{cls.class} • {cls.room}</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">
                  Start Class
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
