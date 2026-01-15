'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlassIcons from '@/components/ui/glass-icons';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, BookOpen, Calendar, Megaphone, BarChart3, Settings, GraduationCap, School } from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();

  const modules = [
    { icon: <Users className="w-6 h-6" />, color: 'blue', label: 'Users', href: '/super-admin/manage/users' },
    { icon: <BookOpen className="w-6 h-6" />, color: 'purple', label: 'Syllabus', href: '/super-admin/manage/syllabus' },
    { icon: <Calendar className="w-6 h-6" />, color: 'indigo', label: 'Calendar', href: '/super-admin/calendar' },
    { icon: <Megaphone className="w-6 h-6" />, color: 'orange', label: 'Posts', href: '/super-admin/post' },
    { icon: <BarChart3 className="w-6 h-6" />, color: 'green', label: 'Reports', href: '/super-admin/reports' },
    { icon: <Settings className="w-6 h-6" />, color: 'red', label: 'Settings', href: '/super-admin/settings' },
  ];

  const glassItems = modules.map(m => ({
    ...m,
    onClick: () => router.push(m.href)
  }));

  const stats = [
    { label: 'Total Students', value: '1,234', icon: <GraduationCap className="w-6 h-6" />, trend: '+12%' },
    { label: 'Total Teachers', value: '56', icon: <Users className="w-6 h-6" />, trend: '+3%' },
    { label: 'Total Classes', value: '24', icon: <School className="w-6 h-6" />, trend: '0%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">Complete control over your school management system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.trend}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
        <div className="flex justify-center">
          <GlassIcons items={glassItems} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New teacher registered', time: '2 mins ago', type: 'success' },
              { action: 'Class 10A exam scheduled', time: '1 hour ago', type: 'info' },
              { action: 'Student fee payment received', time: '3 hours ago', type: 'success' },
              { action: 'Syllabus updated for Mathematics', time: '5 hours ago', type: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-500' : item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  <span>{item.action}</span>
                </div>
                <span className="text-muted-foreground text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
