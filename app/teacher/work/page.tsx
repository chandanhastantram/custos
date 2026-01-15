'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ClipboardList, Plus, CheckCircle, Clock, Users, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function TeacherWorkPage() {
  const [activeTab, setActiveTab] = useState('pending');

  const assignments = [
    { id: 1, title: 'Chapter 5 Worksheet', class: '10A', subject: 'Mathematics', submitted: 28, total: 35, due: 'Jan 18', status: 'active' },
    { id: 2, title: 'Physics Lab Report', class: '11B', subject: 'Physics', submitted: 18, total: 30, due: 'Jan 20', status: 'active' },
    { id: 3, title: 'Essay: My Favorite Book', class: '10A', subject: 'English', submitted: 35, total: 35, due: 'Jan 12', status: 'completed' },
  ];

  const pendingCorrections = [
    { student: 'Alice Johnson', assignment: 'Chapter 5 Worksheet', submittedAt: '2 hours ago' },
    { student: 'Bob Smith', assignment: 'Chapter 5 Worksheet', submittedAt: '3 hours ago' },
    { student: 'Charlie Brown', assignment: 'Physics Lab Report', submittedAt: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ClipboardList className="w-7 h-7" />
            Work Management
          </h2>
          <p className="text-muted-foreground">Assign and manage student work</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-muted-foreground text-sm">Active Assignments</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-muted-foreground text-sm">Pending Corrections</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-muted-foreground text-sm">Completed This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {['pending', 'active', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 capitalize ${
              activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-muted-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6 space-y-4">
          {assignments.map(assignment => (
            <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.class} • {assignment.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-medium">{assignment.submitted}/{assignment.total}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Due: {assignment.due}</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Corrections */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {pendingCorrections.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{item.student}</p>
                  <p className="text-sm text-muted-foreground">{item.assignment} • {item.submittedAt}</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  Grade
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
