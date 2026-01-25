'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import AdminChatbot, { AdminChatbotTrigger } from '@/components/admin-chatbot';

export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="Sub Admin" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Admin AI Chatbot */}
      {!chatbotOpen && <AdminChatbotTrigger onClick={() => setChatbotOpen(true)} />}
      <AdminChatbot isOpen={chatbotOpen} onToggle={() => setChatbotOpen(false)} />
    </div>
  );
}
