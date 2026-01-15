'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SubAdminCalendarPage() {
  const [currentMonth] = useState(new Date());

  const events = [
    { date: '2026-01-20', title: 'Staff Meeting', type: 'meeting', time: '09:00 AM' },
    { date: '2026-01-22', title: 'Math Exam - Class 10', type: 'exam', time: '10:00 AM' },
    { date: '2026-01-25', title: 'Republic Day Holiday', type: 'holiday', time: 'All Day' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-muted-foreground">View and manage school events</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-muted"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg hover:bg-muted"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map(day => (
                <div key={day} className="text-center text-sm text-muted-foreground font-medium py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                const isCurrentMonth = day >= 1 && day <= 31;
                return (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                    !isCurrentMonth ? 'text-muted-foreground/30' : 'hover:bg-muted cursor-pointer'
                  }`}>
                    {isCurrentMonth ? day : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
