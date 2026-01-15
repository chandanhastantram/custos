'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Wand2, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIGradingPage() {
  const router = useRouter();

  const pendingSubmissions = [
    { student: 'Alice Johnson', assignment: 'Essay: Climate Change', submitted: '2 hours ago' },
    { student: 'Bob Smith', assignment: 'Essay: Climate Change', submitted: '3 hours ago' },
    { student: 'Charlie Brown', assignment: 'Short Answers: Chapter 5', submitted: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wand2 className="w-7 h-7" />
            AI Smart Grading
          </h2>
          <p className="text-muted-foreground">AI-assisted grading for subjective answers</p>
        </div>
      </div>

      {/* Info */}
      <div className="relative rounded-xl border border-purple-500/30 p-1">
        <div className="relative bg-purple-500/10 rounded-lg p-4">
          <p className="text-sm">
            AI will analyze student answers against the expected rubric and provide suggested scores with detailed feedback. You can review and adjust before finalizing.
          </p>
        </div>
      </div>

      {/* Pending Submissions */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Pending for AI Grading</h3>
          <div className="space-y-3">
            {pendingSubmissions.map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium">{sub.student}</p>
                    <p className="text-sm text-muted-foreground">{sub.assignment} • {sub.submitted}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                  <Wand2 className="w-4 h-4" />
                  Grade with AI
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Graded */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recently AI-Graded</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium">Diana Prince - Essay: My Role Model</p>
                  <p className="text-sm text-muted-foreground">AI Score: 42/50 • Reviewed</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Finalized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
