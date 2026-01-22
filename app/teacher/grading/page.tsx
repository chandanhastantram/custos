'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CheckCircle, Clock, User, FileText, Star } from 'lucide-react';
import { useState } from 'react';

export default function GradingPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Mock data
  const submissions = [
    { id: 1, student: 'Alice Johnson', rollNo: '10A-001', assignment: 'Quadratic Equations Practice', submittedAt: '2026-01-25 14:30', status: 'pending', totalMarks: 50 },
    { id: 2, student: 'Bob Smith', rollNo: '10A-002', assignment: 'Quadratic Equations Practice', submittedAt: '2026-01-25 16:45', status: 'pending', totalMarks: 50 },
    { id: 3, student: 'Charlie Brown', rollNo: '10B-001', assignment: 'Essay on Climate Change', submittedAt: '2026-01-24 10:20', status: 'graded', totalMarks: 100, marksObtained: 85 },
  ];

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <CheckCircle className="w-7 h-7" />
            Grade Submissions
          </h2>
          <p className="text-muted-foreground">Review and grade student work</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
          <Clock className="w-5 h-5 text-orange-400" />
          <span className="font-medium text-orange-400">{pendingCount} Pending</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: submissions.length, color: 'blue' },
          { label: 'Pending', value: pendingCount, color: 'orange' },
          { label: 'Graded', value: submissions.filter(s => s.status === 'graded').length, color: 'green' },
          { label: 'Avg Score', value: '85%', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={20} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Submissions Queue</h3>
          {submissions.map((submission) => (
            <div 
              key={submission.id} 
              onClick={() => setSelectedSubmission(submission)}
              className={`relative rounded-xl border p-1 cursor-pointer transition-all ${
                selectedSubmission?.id === submission.id ? 'border-blue-500' : 'border-border'
              }`}
            >
              <GlowingEffect spread={25} glow={selectedSubmission?.id === submission.id} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{submission.student}</p>
                    <p className="text-sm text-muted-foreground">{submission.rollNo}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    submission.status === 'pending' 
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {submission.status}
                  </span>
                </div>
                <p className="text-sm mb-2">{submission.assignment}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Submitted: {submission.submittedAt}</span>
                  {submission.status === 'graded' && (
                    <span className="font-medium text-green-400">{submission.marksObtained}/{submission.totalMarks}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grading Panel */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            {selectedSubmission ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Grading: {selectedSubmission.student}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.assignment}</p>
                </div>

                {/* Student Answer */}
                <div>
                  <label className="block text-sm font-medium mb-2">Student's Answer</label>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <p className="text-sm">
                      [Student's answer would be displayed here. This could be text, file attachments, or multiple choice selections.]
                    </p>
                  </div>
                </div>

                {/* Marks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Marks Obtained</label>
                    <input 
                      type="number" 
                      max={selectedSubmission.totalMarks}
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Marks</label>
                    <input 
                      type="number" 
                      value={selectedSubmission.totalMarks}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border opacity-50"
                    />
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium mb-2">Feedback</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                    placeholder="Provide feedback to the student..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    Save Draft
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                    Submit Grade
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Select a submission to start grading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
