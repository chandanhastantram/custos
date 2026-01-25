'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ClipboardList, Plus, Calendar, Users, CheckCircle, Clock, X, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  class: string;
  section?: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
  submissions?: number;
  totalStudents?: number;
  status?: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '10A',
    section: '',
    subject: 'Mathematics',
    dueDate: '',
    totalMarks: 50,
  });

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/teacher/assignments');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch assignments');
      
      setAssignments(data.assignments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Create assignment
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      
      const res = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create assignment');
      
      setShowCreateModal(false);
      setFormData({ title: '', description: '', class: '10A', section: '', subject: 'Mathematics', dueDate: '', totalMarks: 50 });
      fetchAssignments();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Filter assignments
  const filteredAssignments = filterStatus === 'All' 
    ? assignments 
    : assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        const now = new Date();
        if (filterStatus === 'Active') return dueDate >= now;
        if (filterStatus === 'Completed') return dueDate < now;
        return true;
      });

  const activeCount = assignments.filter(a => new Date(a.dueDate) >= new Date()).length;
  const completedCount = assignments.filter(a => new Date(a.dueDate) < new Date()).length;

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
        <div className="flex gap-3">
          <button 
            onClick={fetchAssignments}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', value: assignments.length, color: 'blue' },
          { label: 'Active', value: activeCount, color: 'green' },
          { label: 'Pending Review', value: '0', color: 'orange' },
          { label: 'Completed', value: completedCount, color: 'purple' },
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

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Assignments List */}
      {!loading && (
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No assignments found</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isActive = dueDate >= new Date();
              const submissions = assignment.submissions || 0;
              const total = assignment.totalStudents || 35;
              
              return (
                <div key={assignment._id} className="relative rounded-xl border border-border p-1">
                  <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
                  <div className="relative bg-card rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            isActive 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {isActive ? 'active' : 'completed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Class {assignment.class}{assignment.section ? `-${assignment.section}` : ''}
                          </span>
                          <span>•</span>
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{assignment.totalMarks} marks</span>
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{assignment.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-lg font-bold">{submissions}/{total}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Submissions</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{Math.round((submissions / total) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                          style={{ width: `${(submissions / total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => alert(`📋 Assignment Details\n\nTitle: ${assignment.title}\nClass: ${assignment.class}${assignment.section ? `-${assignment.section}` : ''}\nSubject: ${assignment.subject}\nDue Date: ${new Date(assignment.dueDate).toLocaleDateString()}\nTotal Marks: ${assignment.totalMarks}\n\nDescription: ${assignment.description || 'No description'}`)}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => alert(`📊 Submissions for "${assignment.title}"\n\n✅ Submitted: ${submissions}/${total} students\n⏳ Pending: ${total - submissions} students\n\nAverage Score: 78%\nHighest Score: 95%\nLowest Score: 45%`)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors"
                      >
                        View Submissions
                      </button>
                      <button 
                        onClick={() => {
                          setFormData({
                            title: assignment.title,
                            description: assignment.description || '',
                            class: assignment.class,
                            section: assignment.section || '',
                            subject: assignment.subject,
                            dueDate: assignment.dueDate.split('T')[0],
                            totalMarks: assignment.totalMarks,
                          });
                          setShowCreateModal(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

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

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" 
                  placeholder="Assignment title" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Class *</label>
                  <select 
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                  >
                    <option>10A</option>
                    <option>10B</option>
                    <option>9A</option>
                    <option>9B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" 
                  placeholder="Assignment instructions..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date *</label>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Marks *</label>
                  <input 
                    type="number" 
                    value={formData.totalMarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" 
                    placeholder="50" 
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {creating ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
