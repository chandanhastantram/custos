'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function SubAdminTimetablePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10A');

  const classes = ['10A', '10B', '9A', '9B', '8A', '8B'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { num: 1, time: '08:00 - 08:45' },
    { num: 2, time: '08:45 - 09:30' },
    { num: 3, time: '09:45 - 10:30' },
    { num: 4, time: '10:30 - 11:15' },
    { num: 5, time: '11:30 - 12:15' },
    { num: 6, time: '12:15 - 01:00' },
  ];

  const [timetable, setTimetable] = useState({
    'Monday': {
      1: { subject: 'Mathematics', teacher: 'Mr. Smith' },
      2: { subject: 'English', teacher: 'Ms. Johnson' },
      3: { subject: 'Physics', teacher: 'Mr. Brown' },
      4: { subject: 'Chemistry', teacher: 'Ms. Davis' },
      5: { subject: 'History', teacher: 'Mr. Wilson' },
      6: { subject: 'Geography', teacher: 'Ms. Taylor' },
    },
    'Tuesday': {
      1: { subject: 'English', teacher: 'Ms. Johnson' },
      2: { subject: 'Mathematics', teacher: 'Mr. Smith' },
      3: { subject: 'Chemistry', teacher: 'Ms. Davis' },
      4: { subject: 'Physics', teacher: 'Mr. Brown' },
      5: { subject: 'Computer', teacher: 'Mr. Lee' },
      6: { subject: 'Biology', teacher: 'Ms. Green' },
    },
  });

  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer', 'PE', 'Art'];
  const teachers = ['Mr. Smith', 'Ms. Johnson', 'Mr. Brown', 'Ms. Davis', 'Mr. Wilson', 'Ms. Taylor', 'Mr. Lee', 'Ms. Green'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            Edit Timetable
          </h2>
          <p className="text-muted-foreground">Modify class schedules (limited to assigned classes)</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit Mode
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="relative rounded-xl border border-blue-500/30 p-1">
        <div className="relative bg-blue-500/10 rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium text-blue-400">Note:</span> You can only edit timetables for classes assigned to you. Changes will be sent for Super Admin approval.
          </p>
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
        <div className="relative bg-card rounded-xl p-4 min-w-[700px]">
          <h3 className="text-lg font-semibold mb-4">Class {selectedClass} - Weekly Schedule</h3>
          
          <div className="grid grid-cols-6 gap-2">
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
                  <p className="font-medium text-sm">P{period.num}</p>
                  <p className="text-xs text-muted-foreground">{period.time}</p>
                </div>
                {days.map(day => {
                  const cell = (timetable as any)[day]?.[period.num];
                  return (
                    <div
                      key={`${day}-${period.num}`}
                      className={`p-2 rounded-lg transition-colors ${
                        isEditing 
                          ? 'bg-muted/50 border-2 border-dashed border-blue-500/50'
                          : 'bg-muted/30'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-1">
                          <select className="w-full text-xs p-1 rounded bg-background border border-border">
                            {subjects.map(s => (
                              <option key={s} selected={cell?.subject === s}>{s}</option>
                            ))}
                          </select>
                          <select className="w-full text-xs p-1 rounded bg-background border border-border">
                            {teachers.map(t => (
                              <option key={t} selected={cell?.teacher === t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      ) : cell ? (
                        <>
                          <p className="font-medium text-xs">{cell.subject}</p>
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

      {/* Recent Changes */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
          <div className="space-y-3">
            {[
              { date: 'Jan 14', change: 'Updated Class 10A Monday Period 3 from Physics to Chemistry', status: 'approved' },
              { date: 'Jan 12', change: 'Swapped periods 4 and 5 for Class 9B on Wednesday', status: 'pending' },
              { date: 'Jan 10', change: 'Added extra class for Class 8A on Saturday', status: 'rejected' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm">{item.change}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
