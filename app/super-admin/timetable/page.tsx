'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, Plus, Edit2, Save } from 'lucide-react';
import { useState } from 'react';

export default function TimetablePage() {
  const [isEditing, setIsEditing] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { num: 1, time: '08:00 - 08:45' },
    { num: 2, time: '08:45 - 09:30' },
    { num: 3, time: '09:45 - 10:30' },
    { num: 4, time: '10:30 - 11:15' },
    { num: 5, time: '11:30 - 12:15' },
    { num: 6, time: '12:15 - 01:00' },
    { num: 7, time: '02:00 - 02:45' },
    { num: 8, time: '02:45 - 03:30' },
  ];

  const classes = ['10A', '10B', '9A', '9B', '8A', '8B'];
  const [selectedClass, setSelectedClass] = useState('10A');

  const sampleTimetable: Record<string, Record<number, { subject: string; teacher: string }>> = {
    'Monday': {
      1: { subject: 'Mathematics', teacher: 'Mr. Smith' },
      2: { subject: 'English', teacher: 'Ms. Johnson' },
      3: { subject: 'Physics', teacher: 'Mr. Brown' },
      4: { subject: 'Chemistry', teacher: 'Ms. Davis' },
      5: { subject: 'History', teacher: 'Mr. Wilson' },
      6: { subject: 'Geography', teacher: 'Ms. Taylor' },
      7: { subject: 'PE', teacher: 'Mr. Anderson' },
      8: { subject: 'Art', teacher: 'Ms. Thomas' },
    },
    'Tuesday': {
      1: { subject: 'English', teacher: 'Ms. Johnson' },
      2: { subject: 'Mathematics', teacher: 'Mr. Smith' },
      3: { subject: 'Chemistry', teacher: 'Ms. Davis' },
      4: { subject: 'Physics', teacher: 'Mr. Brown' },
      5: { subject: 'Computer', teacher: 'Mr. Lee' },
      6: { subject: 'Biology', teacher: 'Ms. Green' },
      7: { subject: 'Music', teacher: 'Mr. White' },
      8: { subject: 'Library', teacher: '-' },
    },
    // More days would follow same pattern
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            Timetable Management
          </h2>
          <p className="text-muted-foreground">Create and manage class schedules</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-green-500 text-white' 
                : 'border border-border hover:bg-muted'
            }`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            {isEditing ? 'Save Changes' : 'Edit Mode'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            <Plus className="w-5 h-5" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="flex gap-2 flex-wrap">
        {classes.map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedClass === cls
                ? 'bg-blue-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="relative rounded-2xl border border-border p-1 overflow-x-auto">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-4 min-w-[900px]">
          <div className="grid grid-cols-7 gap-2">
            {/* Header Row */}
            <div className="p-3 rounded-lg bg-muted/50 font-medium text-center">
              <Clock className="w-5 h-5 mx-auto mb-1" />
              Period
            </div>
            {days.map(day => (
              <div key={day} className="p-3 rounded-lg bg-muted/50 font-medium text-center">
                {day}
              </div>
            ))}

            {/* Period Rows */}
            {periods.map(period => (
              <>
                <div key={`period-${period.num}`} className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-medium">Period {period.num}</p>
                  <p className="text-xs text-muted-foreground">{period.time}</p>
                </div>
                {days.map(day => {
                  const cell = sampleTimetable[day]?.[period.num];
                  return (
                    <div
                      key={`${day}-${period.num}`}
                      className={`p-3 rounded-lg transition-colors ${
                        isEditing 
                          ? 'bg-muted/50 hover:bg-muted cursor-pointer border-2 border-dashed border-border'
                          : 'bg-muted/30'
                      }`}
                    >
                      {cell ? (
                        <>
                          <p className="font-medium text-sm">{cell.subject}</p>
                          <p className="text-xs text-muted-foreground">{cell.teacher}</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center">-</p>
                      )}
                    </div>
                  );
                })}
              </>
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
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50" />
          <span>Lab/Practical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/50" />
          <span>Activity Period</span>
        </div>
      </div>
    </div>
  );
}
