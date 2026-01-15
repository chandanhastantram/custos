'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Brain, ArrowLeft, TrendingDown, Lightbulb, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIAnalysisPage() {
  const router = useRouter();

  const weakTopics = [
    { topic: 'Quadratic Equations', subject: 'Mathematics', students: 12, avgScore: 45 },
    { topic: 'Laws of Motion', subject: 'Physics', students: 8, avgScore: 52 },
    { topic: 'Organic Chemistry', subject: 'Chemistry', students: 15, avgScore: 48 },
  ];

  const recommendations = [
    'Schedule revision class for Quadratic Equations',
    'Create visual aids for Laws of Motion concepts',
    'Organize practical lab sessions for Organic Chemistry',
    'Assign additional practice worksheets for weak students',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="w-7 h-7" />
            Weak Topic Analysis
          </h2>
          <p className="text-muted-foreground">Identify and address student weak areas</p>
        </div>
      </div>

      {/* Weak Topics */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Topics Needing Attention
          </h3>
          <div className="space-y-4">
            {weakTopics.map((topic, i) => (
              <div key={i} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{topic.topic}</p>
                    <p className="text-sm text-muted-foreground">{topic.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">{topic.avgScore}%</p>
                    <p className="text-xs text-muted-foreground">avg score</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {topic.students} students struggling
                </div>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${topic.avgScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-medium">
                  {i + 1}
                </div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:opacity-90">
            Generate Improvement Plan
          </button>
        </div>
      </div>
    </div>
  );
}
