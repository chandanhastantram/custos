'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ClipboardList, CheckCircle, Clock, BookOpen, Star, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function DailyWorkPage() {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingWork = [
    { 
      subject: 'Mathematics', 
      type: 'MCQ Quiz',
      topic: 'Quadratic Equations',
      questions: 10,
      dueTime: '2 hours',
      points: 50
    },
    { 
      subject: 'Physics', 
      type: 'Theory Questions',
      topic: 'Laws of Motion',
      questions: 5,
      dueTime: '1 day',
      points: 30
    },
    { 
      subject: 'English', 
      type: 'Essay Writing',
      topic: 'My Favorite Book',
      questions: 1,
      dueTime: '2 days',
      points: 25
    },
  ];

  const completedWork = [
    { subject: 'Chemistry', type: 'MCQ Quiz', score: '8/10', points: 40, date: 'Yesterday' },
    { subject: 'Mathematics', type: 'Practice Set', score: '15/20', points: 35, date: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Work</h2>
          <p className="text-muted-foreground">Complete your assignments and earn points</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
          <Star className="w-5 h-5" />
          <span className="font-semibold">2,450 Points</span>
        </div>
      </div>

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

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingWork.map((work, i) => (
            <div key={i} className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{work.topic}</h3>
                        <p className="text-muted-foreground text-sm">{work.subject} • {work.type}</p>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">+{work.points}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        {work.questions} questions
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <Clock className="w-4 h-4" />
                        Due in {work.dueTime}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity">
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {completedWork.map((work, i) => (
            <div key={i} className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{work.subject} - {work.type}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {work.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{work.score}</p>
                    <p className="text-sm text-yellow-400">+{work.points} points</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
