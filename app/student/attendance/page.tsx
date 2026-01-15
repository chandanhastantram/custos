'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CheckCircle, XCircle, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function StudentAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState('January');

  const months = ['January', 'February', 'March', 'April', 'May', 'June'];

  // Sample attendance data (true = present, false = absent, null = holiday/weekend)
  const attendanceData: Record<string, (boolean | null)[]> = {
    'January': [
      true, true, true, true, true, null, null, // Week 1
      true, true, false, true, true, null, null, // Week 2
      true, true, true, true, true, null, null, // Week 3
      null, true, true, true, true, null, null, // Week 4 (Republic Day)
      true, true, true // Remaining days
    ],
    'February': [
      true, null, null, true, true, true, true, // Week 1
      true, null, null, true, true, true, false, // Week 2
      true, null, null, true, true, true, true, // Week 3
      true, null, null, true, true, true, true, // Week 4
    ],
  };

  const currentData = attendanceData[selectedMonth] || [];
  const presentDays = currentData.filter(d => d === true).length;
  const absentDays = currentData.filter(d => d === false).length;
  const workingDays = presentDays + absentDays;
  const percentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Attendance</h2>
          <p className="text-muted-foreground">Track your attendance record</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Attendance</p>
                <p className={`text-3xl font-bold ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage}%
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Present Days</p>
                <p className="text-3xl font-bold text-green-400">{presentDays}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Absent Days</p>
                <p className="text-3xl font-bold text-red-400">{absentDays}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Working Days</p>
                <p className="text-3xl font-bold">{workingDays}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 flex-wrap">
        {months.map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMonth === month
                ? 'bg-blue-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Attendance Calendar */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedMonth} 2026</h3>
          
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset (assuming month starts on Wednesday) */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Attendance Days */}
            {currentData.map((status, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors ${
                  status === null 
                    ? 'bg-muted/30 text-muted-foreground' 
                    : status 
                      ? 'bg-green-500/20 border border-green-500/50' 
                      : 'bg-red-500/20 border border-red-500/50'
                }`}
              >
                <span className="text-sm font-medium">{i + 1}</span>
                {status !== null && (
                  status 
                    ? <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                    : <XCircle className="w-4 h-4 text-red-400 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {percentage < 75 && (
        <div className="relative rounded-xl border border-yellow-500/30 p-1">
          <div className="relative bg-yellow-500/10 rounded-lg p-4 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-200">Attendance Warning</p>
              <p className="text-sm text-muted-foreground">
                Your attendance is below 75%. You need {Math.ceil(0.75 * (workingDays + 5) - presentDays)} more days to reach the minimum requirement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-muted/30" />
          <span>Holiday/Weekend</span>
        </div>
      </div>
    </div>
  );
}
