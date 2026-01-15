'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, Download, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export default function ParentReportsPage() {
  const [selectedChild, setSelectedChild] = useState('Alice');
  const children = ['Alice', 'Bob'];

  const childrenData: Record<string, { subjects: { name: string; score: number; grade: string }[], overall: number, rank: number }> = {
    'Alice': {
      subjects: [
        { name: 'Mathematics', score: 92, grade: 'A' },
        { name: 'Physics', score: 88, grade: 'A' },
        { name: 'Chemistry', score: 78, grade: 'B+' },
        { name: 'English', score: 85, grade: 'A' },
      ],
      overall: 86,
      rank: 5
    },
    'Bob': {
      subjects: [
        { name: 'Mathematics', score: 75, grade: 'B+' },
        { name: 'Science', score: 82, grade: 'A-' },
        { name: 'English', score: 88, grade: 'A' },
        { name: 'Social Studies', score: 79, grade: 'B+' },
      ],
      overall: 81,
      rank: 12
    }
  };

  const data = childrenData[selectedChild];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7" />
            Academic Reports
          </h2>
          <p className="text-muted-foreground">View your children's academic performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border"
          >
            {children.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {selectedChild.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold">{selectedChild}</p>
              <p className="text-muted-foreground">Class {selectedChild === 'Alice' ? '10A' : '7B'}</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 text-center">
            <p className="text-4xl font-bold text-green-400">{data.overall}%</p>
            <p className="text-muted-foreground">Overall Score</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 text-center">
            <p className="text-4xl font-bold text-purple-400">#{data.rank}</p>
            <p className="text-muted-foreground">Class Rank</p>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Subject Performance - {selectedChild}</h3>
          <div className="space-y-4">
            {data.subjects.map((subj, i) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
