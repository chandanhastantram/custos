'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, UserPlus, Search, Filter, MoreVertical, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { useState } from 'react';

export default function ManageUsersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Users', count: 1290 },
    { id: 'students', label: 'Students', count: 1234 },
    { id: 'teachers', label: 'Teachers', count: 45 },
    { id: 'admins', label: 'Admins', count: 11 },
  ];

  const users = [
    { name: 'Alice Johnson', email: 'alice@school.com', role: 'Student', class: '10A', status: 'active' },
    { name: 'John Smith', email: 'john@school.com', role: 'Teacher', class: 'Math', status: 'active' },
    { name: 'Sarah Williams', email: 'sarah@school.com', role: 'Student', class: '9B', status: 'active' },
    { name: 'Mike Brown', email: 'mike@school.com', role: 'Sub-Admin', class: '-', status: 'active' },
    { name: 'Emily Davis', email: 'emily@school.com', role: 'Parent', class: '-', status: 'inactive' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Student': return <GraduationCap className="w-4 h-4" />;
      case 'Teacher': return <BookOpen className="w-4 h-4" />;
      case 'Sub-Admin': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <p className="text-muted-foreground">Add, edit, and manage all users in the system</p>
        </div>
        <button 
          onClick={() => alert('➕ Add User\n\nThis feature will open a form to add:\n• Students\n• Teachers\n• Parents\n• Sub-Admins\n\nThe form includes role selection, personal details, and login credentials.')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <button 
          onClick={() => alert('🔍 Filter Options\n\n• By Role: Student, Teacher, Parent, Admin\n• By Status: Active, Inactive\n• By Class: 1-12\n• By Date Joined')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} <span className="text-xs ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Class/Subject</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.class}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => alert(`👤 ${user.name}\n\nEmail: ${user.email}\nRole: ${user.role}\nClass/Subject: ${user.class}\nStatus: ${user.status}\n\nActions:\n• Edit Profile\n• Reset Password\n• Change Status\n• Delete User`)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
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
