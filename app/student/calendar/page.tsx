'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function StudentCalendarPage() {
  const [currentMonth] = useState(new Date());

  const events = [
    { date: '2026-01-18', title: 'Math Test', time: '10:00 AM', type: 'exam' },
    { date: '2026-01-20', title: 'Science Project Due', time: '5:00 PM', type: 'assignment' },
    { date: '2026-01-22', title: 'Sports Day', time: 'All Day', type: 'event' },
    { date: '2026-01-25', title: 'Republic Day Holiday', time: 'All Day', type: 'holiday' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-500/20 text-red-400';
      case 'assignment': return 'bg-orange-500/20 text-orange-400';
      case 'holiday': return 'bg-green-500/20 text-green-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Calendar</h2>
        <p className="text-muted-foreground">View your schedule, exams, and events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                const hasEvent = [18, 20, 22, 25].includes(day);
                return (
                  <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer ${
                    !isCurrentMonth ? 'text-muted-foreground/30' : hasEvent ? 'bg-blue-500/20' : 'hover:bg-muted'
                  }`}>
                    {isCurrentMonth ? day : ''}
                    {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Upcoming
            </h3>
            <div className="space-y-3">
              {events.map((event, i) => (
                <div key={i} className={`p-3 rounded-lg ${getTypeColor(event.type)}`}>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
