'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, GraduationCap, BookOpen, Shield, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubAdminManagePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('students');

  const categories = [
    { id: 'students', label: 'Students', icon: <GraduationCap className="w-6 h-6" />, count: 1234, color: 'blue' },
    { id: 'teachers', label: 'Teachers', icon: <BookOpen className="w-6 h-6" />, count: 56, color: 'green' },
    { id: 'classes', label: 'Classes', icon: <Users className="w-6 h-6" />, count: 24, color: 'purple' },
  ];

  const students = [
    { name: 'Alice Johnson', class: '10A', rollNo: '15', attendance: '95%', status: 'active' },
    { name: 'Bob Smith', class: '10A', rollNo: '16', attendance: '88%', status: 'active' },
    { name: 'Charlie Brown', class: '10B', rollNo: '8', attendance: '92%', status: 'active' },
    { name: 'Diana Prince', class: '9A', rollNo: '12', attendance: '78%', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users className="w-7 h-7" />
          Manage
        </h2>
        <p className="text-muted-foreground">View and manage students, teachers, and classes</p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`relative rounded-xl border p-1 cursor-pointer transition-all ${
              selectedCategory === cat.id ? 'border-blue-500' : 'border-border'
            }`}
          >
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-${cat.color}-500/20 flex items-center justify-center text-${cat.color}-400`}>
                  {cat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{cat.count}</p>
                  <p className="text-muted-foreground">{cat.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Class</th>
                <th className="text-left p-4 font-medium">Roll No</th>
                <th className="text-left p-4 font-medium">Attendance</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4">{student.class}</td>
                  <td className="p-4">{student.rollNo}</td>
                  <td className="p-4">{student.attendance}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
