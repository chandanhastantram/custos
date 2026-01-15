'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TeacherCalendarPage() {
  const [currentMonth] = useState(new Date());

  const events = [
    { date: '2026-01-18', title: 'Class 10A Test', time: '10:00 AM', type: 'exam' },
    { date: '2026-01-20', title: 'Staff Meeting', time: '09:00 AM', type: 'meeting' },
    { date: '2026-01-22', title: 'Parent Conference', time: '02:00 PM', type: 'meeting' },
    { date: '2026-01-25', title: 'Republic Day', time: 'All Day', type: 'holiday' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Calendar</h2>
          <p className="text-muted-foreground">View your schedule and upcoming events</p>
        </div>
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
                    !isCurrentMonth ? 'text-muted-foreground/30' : hasEvent ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-muted'
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
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
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
