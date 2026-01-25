'use client';

import DashboardHeader from '@/components/DashboardHeader';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="Teacher" />
      
      {/* Announcements Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm">
            <span className="font-medium text-blue-400">📢 Announcement:</span>{' '}
            <span className="text-muted-foreground">Staff meeting tomorrow at 9 AM in the conference room.</span>
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
