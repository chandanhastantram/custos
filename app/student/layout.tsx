'use client';

import DashboardHeader from '@/components/DashboardHeader';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="Student" />
      
      {/* Announcements Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm">
            <span className="font-medium text-green-400">📢 Reminder:</span>{' '}
            <span className="text-muted-foreground">Math homework due tomorrow! Complete your daily work to earn bonus points.</span>
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
