'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { FileText, Brain, Sparkles, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function LessonPlanPage() {
  const [activeTab, setActiveTab] = useState('current');

  const lessonPlans = [
    { 
      subject: 'Mathematics', 
      class: 'Class 10A',
      chapter: 'Quadratic Equations',
      status: 'in-progress',
      progress: 60,
      totalDays: 10,
      completedDays: 6
    },
    { 
      subject: 'Physics', 
      class: 'Class 11B',
      chapter: 'Laws of Motion',
      status: 'pending',
      progress: 0,
      totalDays: 8,
      completedDays: 0
    },
    { 
      subject: 'Mathematics', 
      class: 'Class 9A',
      chapter: 'Linear Equations',
      status: 'completed',
      progress: 100,
      totalDays: 7,
      completedDays: 7
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lesson Plans</h2>
          <p className="text-muted-foreground">Create and manage AI-powered lesson plans</p>
        </div>
        <button 
          onClick={() => alert('🤖 AI Lesson Plan Generator\n\n1. Upload your syllabus PDF\n2. Select class and subject\n3. AI will generate daily lesson plans\n4. Review and customize')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-5 h-5" />
          Generate with AI
        </button>
      </div>

      {/* AI Generation Card */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">AI Lesson Plan Generator</h3>
              <p className="text-muted-foreground">
                Upload your syllabus and let AI create detailed daily lesson plans with activities, visual aids, and assessments.
              </p>
            </div>
            <button 
              onClick={() => alert('📄 Upload Syllabus\n\nDrag and drop or click to upload your syllabus PDF.')}
              className="px-6 py-3 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'current', label: 'Current Plans' },
          { id: 'completed', label: 'Completed' },
          { id: 'drafts', label: 'Drafts' },
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessonPlans.map((plan, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  plan.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  plan.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {plan.status.replace('-', ' ')}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{plan.chapter}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.subject} • {plan.class}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {plan.completedDays} / {plan.totalDays} days
                  </span>
                  <span className="font-medium">{plan.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>

              <button 
                onClick={() => alert(`📚 Lesson Plan: ${plan.chapter}\n\nSubject: ${plan.subject}\nClass: ${plan.class}\nStatus: ${plan.status}\nProgress: ${plan.progress}%\n\nDaily breakdown:\n• Day 1-2: Introduction\n• Day 3-4: Core concepts\n• Day 5-6: Practice\n• Day 7+: Assessment`)}
                className="w-full mt-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <div className="relative rounded-xl border border-dashed border-border p-1">
          <div className="relative bg-card/50 rounded-lg p-5 h-full flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Create New Plan</p>
            <p className="text-sm text-muted-foreground">Start from scratch or use AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
