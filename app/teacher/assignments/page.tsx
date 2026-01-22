'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ClipboardList, Plus, Calendar, Users, CheckCircle, Clock, X } from 'lucide-react';
import { useState } from 'react';

export default function AssignmentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Mock data
  const assignments = [
    { id: 1, title: 'Quadratic Equations Practice', class: '10A', subject: 'Mathematics', dueDate: '2026-02-01', submissions: 28, total: 35, status: 'active' },
    { id: 2, title: 'Essay on Climate Change', class: '10B', subject: 'English', dueDate: '2026-01-28', submissions: 30, total: 32, status: 'active' },
    { id: 3, title: 'Physics Lab Report', class: '9A', subject: 'Physics', dueDate: '2026-01-25', submissions: 38, total: 38, status: 'completed' },
  ];

  const filteredAssignments = filterStatus === 'All' 
    ? assignments 
    : assignments.filter(a => a.status === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ClipboardList className="w-7 h-7" />
            Assignments
          </h2>
          <p className="text-muted-foreground">Create and manage student assignments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', value: assignments.length, color: 'blue' },
          { label: 'Active', value: assignments.filter(a => a.status === 'active').length, color: 'green' },
          { label: 'Pending Review', value: '45', color: 'orange' },
          { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length, color: 'purple' },
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

      {/* Filter */}
      <div className="flex gap-2">
        {['All', 'Active', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-blue-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assignment.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Class {assignment.class}
                    </span>
                    <span>•</span>
                    <span>{assignment.subject}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-lg font-bold">{assignment.submissions}/{assignment.total}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{Math.round((assignment.submissions / assignment.total) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors">
                  View Submissions
                </button>
                <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create New Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="Assignment title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none">
                    <option>10A</option>
                    <option>10B</option>
                    <option>9A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="Assignment instructions..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Marks</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="50" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
