'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, TrendingUp, Star, Download, Award } from 'lucide-react';

export default function StudentReportsPage() {
  const subjects = [
    { name: 'Mathematics', score: 92, grade: 'A', rank: 3 },
    { name: 'Physics', score: 88, grade: 'A', rank: 5 },
    { name: 'Chemistry', score: 78, grade: 'B+', rank: 12 },
    { name: 'English', score: 85, grade: 'A', rank: 8 },
    { name: 'History', score: 90, grade: 'A', rank: 4 },
  ];

  const recentTests = [
    { name: 'Math Chapter 5', score: 18, total: 20, date: 'Jan 12' },
    { name: 'Physics Quiz', score: 9, total: 10, date: 'Jan 10' },
    { name: 'English Essay', score: 42, total: 50, date: 'Jan 8' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7" />
            My Reports
          </h2>
          <p className="text-muted-foreground">View your academic performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
          <Download className="w-5 h-5" />
          Download Report Card
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">86.6%</p>
            <p className="text-muted-foreground text-sm">Overall Percentage</p>
          </div>
        </div>
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-400">A</p>
            <p className="text-muted-foreground text-sm">Overall Grade</p>
          </div>
        </div>
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">#5</p>
            <p className="text-muted-foreground text-sm">Class Rank</p>
          </div>
        </div>
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 text-center">
            <div className="flex justify-center text-yellow-400 mb-1">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-sm">Top Performer</p>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
          <div className="space-y-4">
            {subjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 font-medium">{subj.name}</div>
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${subj.score}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-center font-bold">{subj.score}%</div>
                <div className="w-12 text-center">
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm">{subj.grade}</span>
                </div>
                <div className="w-16 text-center text-muted-foreground">Rank #{subj.rank}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Test Scores</h3>
          <div className="space-y-3">
            {recentTests.map((test, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-muted-foreground">{test.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{test.score}/{test.total}</p>
                  <p className="text-sm text-muted-foreground">{Math.round((test.score/test.total)*100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
