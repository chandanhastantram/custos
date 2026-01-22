'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, Search, Filter, Plus, Download, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

export default function ManageStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with API call
  const students = [
    { id: 1, name: 'Alice Johnson', rollNo: '10A-001', class: '10A', email: 'alice@example.com', attendance: '95%', avgScore: 85 },
    { id: 2, name: 'Bob Smith', rollNo: '10A-002', class: '10A', email: 'bob@example.com', attendance: '92%', avgScore: 78 },
    { id: 3, name: 'Charlie Brown', rollNo: '10B-001', class: '10B', email: 'charlie@example.com', attendance: '88%', avgScore: 82 },
    { id: 4, name: 'Diana Prince', rollNo: '10B-002', class: '10B', email: 'diana@example.com', attendance: '97%', avgScore: 92 },
  ];

  const classes = ['All', '10A', '10B', '9A', '9B'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Users className="w-7 h-7" />
            Manage Students
          </h2>
          <p className="text-muted-foreground">View and manage student information</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : `Class ${cls}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, color: 'blue' },
          { label: 'Filtered', value: filteredStudents.length, color: 'green' },
          { label: 'Avg Attendance', value: '93%', color: 'purple' },
          { label: 'Avg Score', value: '84', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={20} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Class</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Attendance</th>
                  <th className="text-left py-3 px-4 font-semibold">Avg Score</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{student.rollNo}</td>
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        parseInt(student.attendance) >= 90 ? 'text-green-400' : 
                        parseInt(student.attendance) >= 75 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {student.attendance}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{student.avgScore}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
