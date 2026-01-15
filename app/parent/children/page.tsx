'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, TrendingUp, GraduationCap, BarChart3, MessageCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ParentChildrenPage() {
  const router = useRouter();

  const children = [
    { 
      name: 'Alice Smith', 
      class: 'Class 10A',
      rollNo: '15',
      attendance: '95%',
      overallGrade: 'A',
      subjects: [
        { name: 'Mathematics', grade: 'A+', progress: 92 },
        { name: 'Physics', grade: 'A', progress: 88 },
        { name: 'Chemistry', grade: 'B+', progress: 78 },
        { name: 'English', grade: 'A', progress: 85 },
      ],
      recentTests: [
        { subject: 'Math Weekly Quiz', score: '18/20', date: 'Jan 12' },
        { subject: 'Physics MCQ', score: '9/10', date: 'Jan 10' },
      ],
      upcomingWork: 2
    },
    { 
      name: 'Bob Smith', 
      class: 'Class 7B',
      rollNo: '8',
      attendance: '88%',
      overallGrade: 'B+',
      subjects: [
        { name: 'Mathematics', grade: 'B+', progress: 76 },
        { name: 'Science', grade: 'B', progress: 72 },
        { name: 'English', grade: 'A-', progress: 82 },
        { name: 'Social Studies', grade: 'B+', progress: 75 },
      ],
      recentTests: [
        { subject: 'Science Quiz', score: '7/10', date: 'Jan 13' },
        { subject: 'English Test', score: '42/50', date: 'Jan 8' },
      ],
      upcomingWork: 4
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Children</h2>
        <p className="text-muted-foreground">Track your children&apos;s academic progress</p>
      </div>

      {/* Children Detail Cards */}
      {children.map((child, idx) => (
        <div key={idx} className="space-y-4">
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              {/* Child Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{child.name}</h3>
                    <p className="text-muted-foreground">{child.class} • Roll No. {child.rollNo}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-center px-4 py-2 rounded-lg bg-green-500/20">
                    <p className="text-2xl font-bold text-green-400">{child.attendance}</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-blue-500/20">
                    <p className="text-2xl font-bold text-blue-400">{child.overallGrade}</p>
                    <p className="text-xs text-muted-foreground">Grade</p>
                  </div>
                </div>
              </div>

              {/* Subject Progress */}
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Subject Performance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {child.subjects.map((subj, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{subj.name}</p>
                      <span className="text-sm font-bold">{subj.grade}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${subj.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{subj.progress}% completion</p>
                  </div>
                ))}
              </div>

              {/* Recent Tests & Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Recent Tests
                  </h4>
                  <div className="space-y-2">
                    {child.recentTests.map((test, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{test.subject}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-green-400">{test.score}</span>
                          <span className="text-muted-foreground">{test.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-medium mb-2 text-orange-400">Pending Work</h4>
                  <p className="text-3xl font-bold">{child.upcomingWork}</p>
                  <p className="text-sm text-muted-foreground">assignments due this week</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Full Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Message Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
