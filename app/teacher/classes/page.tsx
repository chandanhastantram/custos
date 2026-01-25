'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { School, Users, BookOpen, TrendingUp, Plus, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ManageClassesPage() {
  const router = useRouter();

  // Mock data - replace with API call
  const classes = [
    { id: 1, name: '10A', subject: 'Mathematics', students: 35, avgScore: 85, attendance: '93%', upcomingTests: 2 },
    { id: 2, name: '10B', subject: 'Mathematics', students: 32, avgScore: 78, attendance: '89%', upcomingTests: 1 },
    { id: 3, name: '9A', subject: 'Science', students: 38, avgScore: 82, attendance: '91%', upcomingTests: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <School className="w-7 h-7" />
            My Classes
          </h2>
          <p className="text-muted-foreground">Manage your assigned classes and students</p>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              {/* Class Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{cls.name}</h3>
                  <p className="text-muted-foreground">{cls.subject}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <p className="text-xl font-bold">{cls.students}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <p className="text-xl font-bold text-green-400">{cls.avgScore}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{cls.attendance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upcoming Tests</span>
                  <span className="font-medium text-orange-400">{cls.upcomingTests}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => router.push(`/teacher/students?class=${cls.name}`)}
                  className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  View Students
                </button>
                <button 
                  onClick={() => router.push(`/teacher/assignments?class=${cls.name}`)}
                  className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors"
                >
                  Assignments
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/teacher/assignments')}
              className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-border hover:border-blue-500/50 transition-all text-left"
            >
              <Plus className="w-6 h-6 text-blue-400 mb-2" />
              <p className="font-medium">Create Assignment</p>
              <p className="text-sm text-muted-foreground">Assign homework to students</p>
            </button>
            <button 
              onClick={() => router.push('/teacher/tests')}
              className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-border hover:border-green-500/50 transition-all text-left"
            >
              <Calendar className="w-6 h-6 text-green-400 mb-2" />
              <p className="font-medium">Create Test</p>
              <p className="text-sm text-muted-foreground">Generate AI questions</p>
            </button>
            <button 
              onClick={() => router.push('/teacher/grading')}
              className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-border hover:border-orange-500/50 transition-all text-left"
            >
              <TrendingUp className="w-6 h-6 text-orange-400 mb-2" />
              <p className="font-medium">Grade Submissions</p>
              <p className="text-sm text-muted-foreground">Review student work</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
