'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, TrendingUp, Users, Download, GraduationCap } from 'lucide-react';

export default function TeacherReportsPage() {
  const classStats = [
    { class: '10A', avgScore: 78, attendance: 94, topStudent: 'Alice Johnson' },
    { class: '10B', avgScore: 72, attendance: 91, topStudent: 'John Smith' },
    { class: '9A', avgScore: 81, attendance: 96, topStudent: 'Emma Wilson' },
  ];

  const recentTests = [
    { name: 'Chapter 5 Quiz', class: '10A', avgScore: 82, highest: 98, lowest: 45 },
    { name: 'Mid-Term Exam', class: '10B', avgScore: 71, highest: 95, lowest: 38 },
    { name: 'Weekly Test', class: '9A', avgScore: 85, highest: 100, lowest: 52 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7" />
            My Reports
          </h2>
          <p className="text-muted-foreground">View class performance and analytics</p>
        </div>
        <button 
          onClick={() => {
            const csv = `Class Report\n\nClass,Avg Score,Attendance,Top Student\n${classStats.map(c => `${c.class},${c.avgScore}%,${c.attendance}%,${c.topStudent}`).join('\n')}\n\nRecent Tests\nTest,Class,Average,Highest,Lowest\n${recentTests.map(t => `${t.name},${t.class},${t.avgScore}%,${t.highest}%,${t.lowest}%`).join('\n')}`;
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teacher_report.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Class Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classStats.map((cls, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Class {cls.class}</h3>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-medium">{cls.avgScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium text-green-400">{cls.attendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Student</span>
                  <span className="font-medium">{cls.topStudent}</span>
                </div>
              </div>
              <button 
                onClick={() => alert(`📊 Class ${cls.class} Details\n\n👥 Total Students: 35\n📈 Average Score: ${cls.avgScore}%\n📅 Attendance: ${cls.attendance}%\n🏆 Top Student: ${cls.topStudent}\n\n📝 Recent Performance:\n• Math Quiz: 85%\n• Science Test: 78%\n• Mid-term: 82%`)}
                className="w-full mt-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Test Results */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Test Name</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Average</th>
                  <th className="text-left p-3 font-medium">Highest</th>
                  <th className="text-left p-3 font-medium">Lowest</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{test.name}</td>
                    <td className="p-3">{test.class}</td>
                    <td className="p-3">{test.avgScore}%</td>
                    <td className="p-3 text-green-400">{test.highest}%</td>
                    <td className="p-3 text-red-400">{test.lowest}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
