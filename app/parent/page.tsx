'use client';

import { useRouter } from 'next/navigation';
import GlassIcons from '@/components/ui/glass-icons';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, Calendar, BarChart3, MessageCircle, Bell, GraduationCap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ParentDashboard() {
  const router = useRouter();

  const modules = [
    { icon: <Users className="w-6 h-6" />, color: 'pink', label: 'Children', href: '/parent/children' },
    { icon: <Calendar className="w-6 h-6" />, color: 'purple', label: 'Calendar', href: '/parent/calendar' },
    { icon: <BarChart3 className="w-6 h-6" />, color: 'blue', label: 'Reports', href: '/parent/reports' },
    { icon: <MessageCircle className="w-6 h-6" />, color: 'green', label: 'Messages', href: '/parent/communication' },
    { icon: <Bell className="w-6 h-6" />, color: 'orange', label: 'Alerts', href: '/parent/notifications' },
  ];

  const glassItems = modules.map(m => ({
    ...m,
    onClick: () => router.push(m.href)
  }));

  const children = [
    { 
      name: 'Alice Smith', 
      class: 'Class 10A', 
      attendance: '95%', 
      grade: 'A',
      trend: 'up',
      recentScore: '92/100'
    },
    { 
      name: 'Bob Smith', 
      class: 'Class 7B', 
      attendance: '88%', 
      grade: 'B+',
      trend: 'stable',
      recentScore: '78/100'
    },
  ];

  const notifications = [
    { type: 'homework', message: 'Alice has pending Math homework', time: '1 hour ago', urgent: true },
    { type: 'score', message: 'Bob scored 85% in Science quiz', time: '3 hours ago', urgent: false },
    { type: 'attendance', message: 'Alice was present today', time: '5 hours ago', urgent: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Parent Dashboard</h2>
        <p className="text-muted-foreground">Stay connected with your children&apos;s education</p>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child, i) => (
          <div key={i} className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{child.name}</h3>
                    <p className="text-muted-foreground text-sm">{child.class}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${child.trend === 'up' ? 'text-green-400' : 'text-muted-foreground'}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Improving</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{child.attendance}</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{child.grade}</p>
                  <p className="text-xs text-muted-foreground">Grade</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{child.recentScore}</p>
                  <p className="text-xs text-muted-foreground">Last Test</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/parent/children')}
                className="w-full mt-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
              >
                View Details
              </button>
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

      {/* Recent Notifications */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Notifications</h3>
            <button 
              onClick={() => router.push('/parent/notifications')}
              className="text-sm text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notif.urgent ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {notif.urgent ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className={notif.urgent ? 'text-red-300' : ''}>{notif.message}</p>
                  <p className="text-sm text-muted-foreground">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
