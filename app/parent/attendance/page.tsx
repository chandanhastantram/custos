'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CheckCircle, XCircle, Calendar, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ParentAttendancePage() {
  const [selectedChild, setSelectedChild] = useState('Alice');
  const [selectedMonth, setSelectedMonth] = useState('January');

  const children = ['Alice', 'Bob'];
  const months = ['January', 'February', 'March'];

  const attendanceByChild: Record<string, Record<string, (boolean | null)[]>> = {
    'Alice': {
      'January': [
        true, true, true, true, true, null, null,
        true, true, false, true, true, null, null,
        true, true, true, true, true, null, null,
        null, true, true, true, true, null, null,
        true, true, true
      ],
    },
    'Bob': {
      'January': [
        true, true, true, false, true, null, null,
        true, false, true, true, true, null, null,
        true, true, true, false, true, null, null,
        null, true, true, true, false, null, null,
        true, true, true
      ],
    },
  };

  const currentData = attendanceByChild[selectedChild]?.[selectedMonth] || [];
  const presentDays = currentData.filter(d => d === true).length;
  const absentDays = currentData.filter(d => d === false).length;
  const workingDays = presentDays + absentDays;
  const percentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  const childInfo: Record<string, { class: string; rollNo: string }> = {
    'Alice': { class: '10A', rollNo: '15' },
    'Bob': { class: '7B', rollNo: '8' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Child&apos;s Attendance</h2>
          <p className="text-muted-foreground">Monitor your children&apos;s attendance records</p>
        </div>
        
        {/* Child Selector */}
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none"
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {selectedChild.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedChild}</h3>
            <p className="text-muted-foreground">
              Class {childInfo[selectedChild]?.class} • Roll No. {childInfo[selectedChild]?.rollNo}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className={`text-4xl font-bold ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
              {percentage}%
            </p>
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-xl border border-green-500/30 p-1">
          <div className="relative bg-green-500/10 rounded-lg p-4 flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <div>
              <p className="text-3xl font-bold text-green-400">{presentDays}</p>
              <p className="text-sm text-muted-foreground">Days Present</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-red-500/30 p-1">
          <div className="relative bg-red-500/10 rounded-lg p-4 flex items-center gap-4">
            <XCircle className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-3xl font-bold text-red-400">{absentDays}</p>
              <p className="text-sm text-muted-foreground">Days Absent</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-blue-500/30 p-1">
          <div className="relative bg-blue-500/10 rounded-lg p-4 flex items-center gap-4">
            <Calendar className="w-10 h-10 text-blue-400" />
            <div>
              <p className="text-3xl font-bold text-blue-400">{workingDays}</p>
              <p className="text-sm text-muted-foreground">Working Days</p>
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
          <h3 className="text-lg font-semibold mb-4">{selectedMonth} 2026 - {selectedChild}</h3>
          
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
            {/* Empty offset */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days */}
            {currentData.map((status, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
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

      {/* Absence Details */}
      {absentDays > 0 && (
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Absence Details - {selectedMonth}</h3>
            <div className="space-y-2">
              {currentData.map((status, i) => {
                if (status === false) {
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>{selectedMonth} {i + 1}, 2026</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Absent</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
