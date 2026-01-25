'use client';

import DashboardHeader from '@/components/DashboardHeader';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="Parent" />
      
      {/* Announcements Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm">
            <span className="font-medium text-blue-500">📢 Upcoming:</span>{' '}
            <span className="text-muted-foreground">Parent-Teacher meeting scheduled for next Friday. Please confirm your attendance.</span>
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
