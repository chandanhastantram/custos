'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Bell, CheckCircle, AlertTriangle, Info, Calendar, FileText, Check } from 'lucide-react';
import { useState } from 'react';

export default function ParentNotificationsPage() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    { id: 1, type: 'alert', title: 'Low Attendance Warning', message: 'Bob\'s attendance is below 85% this month', time: '2 hours ago', read: false },
    { id: 2, type: 'info', title: 'Exam Schedule Released', message: 'Mid-term exam schedule for Class 10 released', time: '1 day ago', read: false },
    { id: 3, type: 'event', title: 'PTM Scheduled', message: 'Parent-Teacher Meeting on Jan 22 at 2:00 PM', time: '2 days ago', read: true },
    { id: 4, type: 'homework', title: 'Homework Reminder', message: 'Alice has 3 pending assignments due tomorrow', time: '3 days ago', read: true },
    { id: 5, type: 'info', title: 'Fee Payment Reminder', message: 'Q3 fees due by February 15, 2026', time: '5 days ago', read: true },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'homework': return <FileText className="w-5 h-5 text-orange-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-500/20';
      case 'event': return 'bg-purple-500/20';
      case 'homework': return 'bg-orange-500/20';
      default: return 'bg-blue-500/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bell className="w-7 h-7" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-500 text-white text-sm">{unreadCount}</span>
            )}
          </h2>
          <p className="text-muted-foreground">Stay updated with school announcements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
          <Check className="w-5 h-5" />
          Mark All Read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'unread', 'alerts', 'events'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-4 space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                !notif.read ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${getBgColor(notif.type)} flex items-center justify-center`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                  </div>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
