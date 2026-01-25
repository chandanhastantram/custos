'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Crown, Settings, GraduationCap, BookOpen, Users } from 'lucide-react';

export default function HomePage() {
  const roles = [
    { name: 'Super Admin', path: '/super-admin', icon: <Crown className="w-6 h-6" />, color: 'from-blue-600 to-blue-600', description: 'Full system control & analytics' },
    { name: 'Sub Admin', path: '/sub-admin', icon: <Settings className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', description: 'Manage daily operations' },
    { name: 'Teacher', path: '/teacher', icon: <BookOpen className="w-6 h-6" />, color: 'from-green-500 to-green-600', description: 'Lessons, work & reports' },
    { name: 'Student', path: '/student', icon: <GraduationCap className="w-6 h-6" />, color: 'from-orange-500 to-orange-600', description: 'Learn, practice & grow' },
    { name: 'Parent', path: '/parent', icon: <Users className="w-6 h-6" />, color: 'from-blue-500 to-cyan-600', description: 'Track child progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            CUSTOS 1.0
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              School Management System
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI-powered platform for managing students, teachers, and parents with comprehensive analytics
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Demo Mode Active
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Link key={role.name} href={role.path}>
                <div className="relative h-full rounded-2xl border border-border p-1 group">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                  />
                  <div className="relative flex flex-col h-full p-6 rounded-xl bg-card shadow-lg group-hover:shadow-xl transition-all">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {role.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{role.description}</p>
                    <div className="mt-4 text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                      Open Dashboard →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-muted-foreground text-sm">
        © 2026 CUSTOS - AI-Powered School Management
      </footer>
    </div>
  );
}
