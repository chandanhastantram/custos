'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, TrendingUp, Users, GraduationCap, BookOpen, Download } from 'lucide-react';

export default function ReportsPage() {
  const stats = [
    { label: 'Overall Attendance', value: '94.2%', trend: '+2.1%', icon: <Users className="w-5 h-5" /> },
    { label: 'Average Score', value: '78.5%', trend: '+5.3%', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Completion Rate', value: '89%', trend: '+12%', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const topPerformers = [
    { name: 'Class 10A', subject: 'Mathematics', score: 92 },
    { name: 'Class 9B', subject: 'Science', score: 88 },
    { name: 'Class 11A', subject: 'Physics', score: 85 },
    { name: 'Class 8A', subject: 'English', score: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights across the school</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Placeholder */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Over Time
            </h3>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Classes</h3>
            <div className="space-y-4">
              {topPerformers.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.score}%</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
