'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function TeacherSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weeklySchedule = [
    // Week 1
    {
      'Monday': [
        { time: '09:00 - 09:45', subject: 'Mathematics', class: '10A', room: '101' },
        { time: '10:00 - 10:45', subject: 'Mathematics', class: '10B', room: '102' },
        { time: '11:00 - 11:45', subject: 'Free Period', class: '-', room: '-' },
        { time: '02:00 - 02:45', subject: 'Mathematics', class: '9A', room: '105' },
      ],
      'Tuesday': [
        { time: '09:00 - 09:45', subject: 'Mathematics', class: '11A', room: '201' },
        { time: '10:00 - 10:45', subject: 'Mathematics', class: '10A', room: '101' },
        { time: '11:00 - 11:45', subject: 'Lab', class: '10B', room: 'Lab 2' },
        { time: '02:00 - 02:45', subject: 'Free Period', class: '-', room: '-' },
      ],
      'Wednesday': [
        { time: '09:00 - 09:45', subject: 'Mathematics', class: '9B', room: '106' },
        { time: '10:00 - 10:45', subject: 'Mathematics', class: '10A', room: '101' },
        { time: '11:00 - 11:45', subject: 'Mathematics', class: '11A', room: '201' },
        { time: '02:00 - 02:45', subject: 'Staff Meeting', class: '-', room: 'Conference' },
      ],
      'Thursday': [
        { time: '09:00 - 09:45', subject: 'Mathematics', class: '10B', room: '102' },
        { time: '10:00 - 10:45', subject: 'Free Period', class: '-', room: '-' },
        { time: '11:00 - 11:45', subject: 'Mathematics', class: '9A', room: '105' },
        { time: '02:00 - 02:45', subject: 'Mathematics', class: '9B', room: '106' },
      ],
      'Friday': [
        { time: '09:00 - 09:45', subject: 'Mathematics', class: '11A', room: '201' },
        { time: '10:00 - 10:45', subject: 'Lab', class: '10A', room: 'Lab 2' },
        { time: '11:00 - 11:45', subject: 'Mathematics', class: '10B', room: '102' },
        { time: '02:00 - 02:45', subject: 'Parent Meeting', class: '-', room: 'Hall' },
      ],
      'Saturday': [
        { time: '09:00 - 09:45', subject: 'Extra Class', class: '10A', room: '101' },
        { time: '10:00 - 10:45', subject: 'Extra Class', class: '10B', room: '102' },
      ],
    },
  ];

  const currentSchedule = weeklySchedule[0];

  const monthlyStats = {
    totalClasses: 96,
    subjects: 1,
    classes: 6,
    averagePerDay: 4,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            My Schedule
          </h2>
          <p className="text-muted-foreground">View your teaching schedule for the semester</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Month View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Classes This Month', value: monthlyStats.totalClasses, icon: <BookOpen className="w-5 h-5" /> },
          { label: 'Subjects', value: monthlyStats.subjects, icon: <BookOpen className="w-5 h-5" /> },
          { label: 'Classes Assigned', value: monthlyStats.classes, icon: <Clock className="w-5 h-5" /> },
          { label: 'Avg Per Day', value: monthlyStats.averagePerDay, icon: <Calendar className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={20} glow={true} disabled={false} proximity={30} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          Week {currentWeek + 1} - January 2026
        </h3>
        <button 
          onClick={() => setCurrentWeek(currentWeek + 1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-4 overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 min-w-[800px]">
            {days.map(day => (
              <div key={day} className="space-y-3">
                <h4 className="font-semibold text-center py-2 rounded-lg bg-muted/50">{day}</h4>
                <div className="space-y-2">
                  {(currentSchedule[day as keyof typeof currentSchedule] || []).map((slot, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg transition-colors ${
                        slot.subject === 'Free Period' 
                          ? 'bg-muted/30 border border-dashed border-border' 
                          : slot.subject.includes('Meeting') || slot.subject.includes('Lab')
                            ? 'bg-blue-600/10 border border-blue-600/30'
                            : 'bg-blue-500/10 border border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        {slot.time}
                      </div>
                      <p className="font-medium text-sm">{slot.subject}</p>
                      {slot.class !== '-' && (
                        <p className="text-xs text-muted-foreground">{slot.class}</p>
                      )}
                      {slot.room !== '-' && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {slot.room}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50" />
          <span>Regular Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600/20 border border-blue-600/50" />
          <span>Lab/Meeting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/30 border border-dashed border-border" />
          <span>Free Period</span>
        </div>
      </div>
    </div>
  );
}
