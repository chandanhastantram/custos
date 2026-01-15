'use client';

import { useRouter } from 'next/navigation';
import GlassIcons from '@/components/ui/glass-icons';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, Calendar, Megaphone, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function SubAdminDashboard() {
  const router = useRouter();

  const modules = [
    { icon: <Users className="w-6 h-6" />, color: 'blue', label: 'Manage', href: '/sub-admin/manage' },
    { icon: <Calendar className="w-6 h-6" />, color: 'purple', label: 'Calendar', href: '/sub-admin/calendar' },
    { icon: <Megaphone className="w-6 h-6" />, color: 'orange', label: 'Posts', href: '/sub-admin/post' },
    { icon: <BookOpen className="w-6 h-6" />, color: 'green', label: 'Syllabus', href: '/sub-admin/syllabus' },
  ];

  const glassItems = modules.map(m => ({
    ...m,
    onClick: () => router.push(m.href)
  }));

  const todaysTasks = [
    { task: 'Approve 5 leave requests', priority: 'high' },
    { task: 'Update Class 8B timetable', priority: 'medium' },
    { task: 'Post weekly announcement', priority: 'low' },
    { task: 'Review teacher attendance', priority: 'medium' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Sub-Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage daily operations efficiently</p>
      </div>

      {/* Alert Banner */}
      <div className="relative rounded-2xl border border-yellow-500/30 p-1">
        <div className="relative bg-yellow-500/10 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="font-medium text-yellow-200">Note: Reports module is restricted</p>
            <p className="text-sm text-muted-foreground">Contact Super Admin for analytics access</p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
        <div className="flex justify-center">
          <GlassIcons items={glassItems} />
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Today&apos;s Tasks</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="space-y-3">
            {todaysTasks.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-border" />
                <span className="flex-1">{item.task}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
