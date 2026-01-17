'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface TimetableEntry {
  _id: string;
  day: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: { _id: string; name: string } | string;
  teacher: { _id: string; name: string } | string;
  room?: string;
  type: 'regular' | 'lab' | 'activity';
}

interface TimetableData {
  _id: string;
  name: string;
  class: { _id: string; name: string };
  section: string;
  entries: TimetableEntry[];
}

export default function ParentSchedulePage() {
  const [selectedChild, setSelectedChild] = useState('Alice');
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayIndex = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] === 'Sunday' ? 'Monday' : days[dayIndex];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timetables, setTimetables] = useState<TimetableData[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableData | null>(null);

  // Mock children data - in production this would come from user context
  const children = ['Alice', 'Bob'];
  const childInfo: Record<string, { class: string; rollNo: string }> = {
    'Alice': { class: '10A', rollNo: '15' },
    'Bob': { class: '7B', rollNo: '8' },
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch timetables on mount
  const fetchTimetables = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/timetables?isActive=true');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setTimetables(data.data);
        
        // Fetch full timetable with entries for the first one
        const timetableResponse = await fetch(`/api/timetables/${data.data[0]._id}`);
        const timetableData = await timetableResponse.json();
        
        if (timetableData.success) {
          setSelectedTimetable(timetableData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  // Get entries for selected day
  const getDayEntries = (): TimetableEntry[] => {
    if (!selectedTimetable?.entries) return [];
    return selectedTimetable.entries
      .filter(entry => entry.day === selectedDay)
      .sort((a, b) => a.periodNumber - b.periodNumber);
  };

  const getSubjectName = (entry: TimetableEntry): string => {
    if (typeof entry.subject === 'object') return entry.subject.name;
    return entry.subject;
  };

  const getTeacherName = (entry: TimetableEntry): string => {
    if (typeof entry.teacher === 'object') return entry.teacher.name;
    return entry.teacher;
  };

  // Get subject color based on type
  const getSubjectColor = (type: string, index: number) => {
    if (type === 'lab') return 'from-green-500 to-emerald-500';
    if (type === 'activity') return 'from-orange-500 to-amber-500';
    
    const colors = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-violet-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-cyan-500',
      'from-yellow-500 to-orange-500',
    ];
    return colors[index % colors.length];
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const currentDayIndex = days.indexOf(selectedDay);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        <span className="ml-2">Loading schedule...</span>
      </div>
    );
  }

  const dayEntries = getDayEntries();

  return (
    <div className="space-y-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            Child&apos;s Schedule
          </h2>
          <p className="text-muted-foreground">View your child&apos;s timetable</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border focus:border-pink-500 focus:outline-none"
          >
            {children.map(child => (
              <option key={child} value={child}>{child}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Info Card */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {selectedChild.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedChild}</h3>
            <p className="text-muted-foreground">
              {childInfo[selectedChild]?.class} • Roll No. {childInfo[selectedChild]?.rollNo}
            </p>
          </div>
          {selectedTimetable && (
            <div className="ml-auto text-right">
              <p className="text-lg font-semibold">{selectedTimetable.name}</p>
              <p className="text-sm text-muted-foreground">Current Schedule</p>
            </div>
          )}
        </div>
      </div>

      {/* Day Selector */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedDay(days[(currentDayIndex - 1 + 6) % 6])}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">{selectedDay}</span>
            <button
              onClick={() => setSelectedDay(days[(currentDayIndex + 1) % 6])}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  selectedDay === day
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50'
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className={`text-sm font-medium ${selectedDay === day ? 'text-pink-400' : ''}`}>
                  {day.slice(0, 3)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">{selectedChild}&apos;s {selectedDay} Classes</h3>
          
          {dayEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for {selectedDay}</p>
              {!selectedTimetable && (
                <p className="text-sm mt-2">No timetable has been created yet.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {dayEntries.map((entry, i) => (
                <div
                  key={entry._id || i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Period Number Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getSubjectColor(entry.type, i)}`}>
                    P{entry.periodNumber}
                  </div>

                  {/* Class Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{getSubjectName(entry)}</h4>
                    <p className="text-sm text-muted-foreground">{getTeacherName(entry)}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                      </span>
                      {entry.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {entry.room}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    entry.type === 'lab' ? 'bg-green-500/20 text-green-400' :
                    entry.type === 'activity' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-pink-500/20 text-pink-400'
                  }`}>
                    {entry.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-500/20 border border-pink-500/50" />
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
