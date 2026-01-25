'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Route, Sparkles, Loader2, BookOpen, Clock, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PriorityTopic {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedTime: string;
  resources: string[];
}

interface StudyDay {
  day: number;
  focus: string;
  activities: string[];
  duration: string;
}

interface Recommendations {
  overallAssessment: string;
  priorityTopics: PriorityTopic[];
  studyPlan: StudyDay[];
  tips: string[];
  encouragement: string;
}

export default function StudyPathPage() {
  const [subject, setSubject] = useState('Mathematics');
  const [weakTopics, setWeakTopics] = useState('');
  const [strongTopics, setStrongTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

  const getRecommendations = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/study-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          weakTopics: weakTopics.split(',').map(t => t.trim()).filter(Boolean),
          strongTopics: strongTopics.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Route className="w-7 h-7 text-blue-400" />
            Study Path
          </h2>
          <p className="text-muted-foreground">Get personalized AI-powered study recommendations</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">AI Powered</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Tell us about your progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weak Topics (comma separated)</label>
              <input
                type="text"
                value={weakTopics}
                onChange={(e) => setWeakTopics(e.target.value)}
                placeholder="e.g., Trigonometry, Calculus"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Strong Topics (comma separated)</label>
              <input
                type="text"
                value={strongTopics}
                onChange={(e) => setStrongTopics(e.target.value)}
                placeholder="e.g., Algebra, Geometry"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="mt-6 w-full px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Study Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Personalized Recommendations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Display */}
      {recommendations && (
        <>
          {/* Overall Assessment */}
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Assessment</h3>
                  <p className="text-muted-foreground">{recommendations.overallAssessment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Topics */}
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                Priority Topics
              </h3>
              <div className="space-y-3">
                {recommendations.priorityTopics.map((topic, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${priorityColors[topic.priority]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{topic.topic}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[topic.priority]}`}>
                            {topic.priority} priority
                          </span>
                        </div>
                        <p className="text-sm opacity-80">{topic.reason}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm opacity-80">
                        <Clock className="w-4 h-4" />
                        {topic.estimatedTime}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topic.resources.map((resource, ri) => (
                        <span key={ri} className="text-xs px-2 py-1 rounded bg-background/50">
                          📚 {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5-Day Study Plan */}
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Your 5-Day Study Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {recommendations.studyPlan.map((day) => (
                  <div key={day.day} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Day {day.day}</span>
                      <span className="text-xs text-muted-foreground">{day.duration}</span>
                    </div>
                    <h4 className="font-medium mb-2">{day.focus}</h4>
                    <ul className="space-y-1">
                      {day.activities.map((activity, ai) => (
                        <li key={ai} className="text-xs text-muted-foreground flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  Study Tips
                </h4>
                <ul className="space-y-2">
                  {recommendations.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-400">💡</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-green-400">🌟 Keep Going!</h4>
                <p className="text-sm text-muted-foreground">{recommendations.encouragement}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
