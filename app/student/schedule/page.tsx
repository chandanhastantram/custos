'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, MapPin, Check, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function StudentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate week dates centered around selected date
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Sample schedule data with attendance
  const scheduleData: Record<string, Array<{
    subject: string;
    code: string;
    classSection: string;
    startTime: string;
    endTime: string;
    room: string;
    hour: number;
    attended: boolean | null; // null = future class
  }>> = {
    '2026-01-16': [
      { subject: 'Data Structures & Algorithms', code: 'CS301', classSection: 'CSE-A Sem 6', startTime: '9:00 AM', endTime: '9:50 AM', room: 'LH-101', hour: 1, attended: true },
      { subject: 'Database Management Systems', code: 'CS302', classSection: 'CSE-A Sem 6', startTime: '9:50 AM', endTime: '10:40 AM', room: 'LH-101', hour: 2, attended: true },
      { subject: 'Operating Systems', code: 'CS303', classSection: 'CSE-A Sem 6', startTime: '11:00 AM', endTime: '11:50 AM', room: 'LH-102', hour: 3, attended: false },
      { subject: 'Computer Networks', code: 'CS304', classSection: 'CSE-A Sem 6', startTime: '11:50 AM', endTime: '12:40 PM', room: 'LH-102', hour: 4, attended: true },
      { subject: 'Web Technologies Lab', code: 'CS305', classSection: 'CSE-A Sem 6', startTime: '2:00 PM', endTime: '3:50 PM', room: 'Lab-3', hour: 5, attended: null },
    ],
    '2026-01-15': [
      { subject: 'Machine Learning', code: 'CS401', classSection: 'CSE-A Sem 6', startTime: '9:00 AM', endTime: '9:50 AM', room: 'LH-201', hour: 1, attended: true },
      { subject: 'Software Engineering', code: 'CS306', classSection: 'CSE-A Sem 6', startTime: '10:00 AM', endTime: '10:50 AM', room: 'LH-201', hour: 2, attended: true },
      { subject: 'Cloud Computing', code: 'CS402', classSection: 'CSE-A Sem 6', startTime: '11:00 AM', endTime: '11:50 AM', room: 'Lab-5', hour: 3, attended: true },
    ],
  };

  // Subject-wise attendance data
  const subjectAttendance = [
    { subject: 'Data Structures & Algorithms', code: 'CS301', present: 18, total: 20, percentage: 90 },
    { subject: 'Database Management Systems', code: 'CS302', present: 17, total: 20, percentage: 85 },
    { subject: 'Operating Systems', code: 'CS303', present: 15, total: 20, percentage: 75 },
    { subject: 'Computer Networks', code: 'CS304', present: 19, total: 20, percentage: 95 },
    { subject: 'Web Technologies Lab', code: 'CS305', present: 14, total: 18, percentage: 78 },
    { subject: 'Machine Learning', code: 'CS401', present: 16, total: 18, percentage: 89 },
  ];

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const currentSchedule = scheduleData[formatDateKey(selectedDate)] || [];
  const isToday = (date: Date) => formatDateKey(date) === formatDateKey(new Date());
  const isSelected = (date: Date) => formatDateKey(date) === formatDateKey(selectedDate);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  // Get subject color based on index
  const getSubjectColor = (index: number) => {
    const colors = [
      'from-yellow-500 to-orange-500',
      'from-cyan-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-violet-500',
      'from-amber-500 to-yellow-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Calendar className="w-7 h-7" />
          Timetable
        </h2>
        <p className="text-muted-foreground">View your daily schedule and attendance</p>
      </div>

      {/* Date Picker */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  isSelected(date)
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50'
                    : isToday(date)
                      ? 'bg-muted/80 border border-border'
                      : 'hover:bg-muted/50'
                }`}
              >
                <span className="text-xs text-muted-foreground">{monthNames[date.getMonth()]}</span>
                <span className={`text-2xl font-bold ${isSelected(date) ? 'text-yellow-400' : ''}`}>
                  {date.getDate()}
                </span>
                <span className="text-xs text-muted-foreground">{dayNames[date.getDay()]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events/Classes List */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Events</h3>
          
          {currentSchedule.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentSchedule.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  {/* Attendance Status Circle */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getSubjectColor(i)}`}>
                      {event.subject.charAt(0)}
                    </div>
                    {event.attended !== null && (
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        event.attended 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {event.attended ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{event.code} - {event.subject}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{event.classSection}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.room}
                      </span>
                    </div>
                  </div>

                  {/* Hour Number */}
                  <div className="text-right">
                    <span className="text-muted-foreground">hour {event.hour}</span>
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold">Subject-wise Attendance</h3>
          </div>
          
          <div className="space-y-4">
            {subjectAttendance.map((subject, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-xs text-muted-foreground">{subject.code} • {subject.present}/{subject.total} classes</p>
                  </div>
                  <span className={`text-lg font-bold ${
                    subject.percentage >= 75 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subject.percentage >= 75 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-red-500 to-orange-400'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Overall Stats */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-400">87%</p>
                <p className="text-xs text-muted-foreground">Overall Attendance</p>
              </div>
              <div>
                <p className="text-2xl font-bold">99</p>
                <p className="text-xs text-muted-foreground">Classes Attended</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">14</p>
                <p className="text-xs text-muted-foreground">Classes Missed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
