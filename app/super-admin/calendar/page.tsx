'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentMonth] = useState(new Date());

  const events = [
    { date: '2026-01-20', title: 'Staff Meeting', type: 'meeting', time: '09:00 AM' },
    { date: '2026-01-22', title: 'Math Exam - Class 10', type: 'exam', time: '10:00 AM' },
    { date: '2026-01-25', title: 'Republic Day Holiday', type: 'holiday', time: 'All Day' },
    { date: '2026-01-28', title: 'Parent-Teacher Meeting', type: 'meeting', time: '02:00 PM' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-muted-foreground">Manage events, holidays, and schedules</p>
        </div>
        <button 
          onClick={() => alert('📅 Add New Event\n\nForm to add:\n• Event title\n• Date and time\n• Event type (exam, meeting, holiday)\n• Description')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-2 relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert('Navigate to previous month')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => alert('Navigate to next month')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map(day => (
                <div key={day} className="text-center text-sm text-muted-foreground font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3; // Offset for January 2026
                const isCurrentMonth = day >= 1 && day <= 31;
                const isToday = day === 15;
                
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors cursor-pointer ${
                      !isCurrentMonth ? 'text-muted-foreground/30' :
                      isToday ? 'bg-blue-500 text-white' :
                      'hover:bg-muted'
                    }`}
                  >
                    {isCurrentMonth ? day : ''}
                    {isCurrentMonth && [20, 22, 25, 28].includes(day) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6 h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.type === 'exam' ? 'bg-red-500/20 text-red-400' :
                      event.type === 'holiday' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
