'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { MessageCircle, Send, Star, User, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TeacherFeedbackPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const students = [
    { name: 'Alice Johnson', class: '10A', lastFeedback: '2 days ago', performance: 'excellent' },
    { name: 'Bob Smith', class: '10A', lastFeedback: '1 week ago', performance: 'good' },
    { name: 'Charlie Brown', class: '10B', lastFeedback: '3 days ago', performance: 'needs-improvement' },
    { name: 'Diana Prince', class: '9A', lastFeedback: 'Never', performance: 'good' },
  ];

  const recentFeedback = [
    { student: 'Alice Johnson', message: 'Great improvement in problem-solving skills!', date: 'Jan 13' },
    { student: 'Bob Smith', message: 'Needs to focus more on chapter exercises', date: 'Jan 8' },
    { student: 'Charlie Brown', message: 'Good participation in class discussions', date: 'Jan 12' },
  ];

  const getPerformanceColor = (perf: string) => {
    switch (perf) {
      case 'excellent': return 'bg-green-500/20 text-green-400';
      case 'good': return 'bg-blue-500/20 text-blue-400';
      case 'needs-improvement': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageCircle className="w-7 h-7" />
          Student Feedback
        </h2>
        <p className="text-muted-foreground">Provide feedback to students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1 relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-4 max-h-[600px] overflow-y-auto">
            <h3 className="font-semibold mb-4">Select Student</h3>
            <div className="space-y-2">
              {students.map((student, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedStudent(student.name)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedStudent === student.name ? 'bg-blue-500/20 border border-blue-500' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.class}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPerformanceColor(student.performance)}`}>
                      {student.performance.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="lg:col-span-2 relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            {selectedStudent ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedStudent.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent}</h3>
                    <p className="text-muted-foreground">Write feedback for this student</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Performance Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} className="p-2 hover:bg-muted rounded-lg">
                          <Star className="w-6 h-6 text-yellow-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Feedback Message</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your feedback here..."
                      rows={5}
                      className="w-full p-4 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90">
                    <Send className="w-5 h-5" />
                    Send Feedback
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center py-20">
                <div>
                  <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a student to provide feedback</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Feedback Sent
          </h3>
          <div className="space-y-3">
            {recentFeedback.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{item.student}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <p className="text-muted-foreground text-sm">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
