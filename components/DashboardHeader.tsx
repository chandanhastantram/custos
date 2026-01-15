'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ui/theme-toggle';
import { Home } from 'lucide-react';

interface DashboardHeaderProps {
  role?: string;
}

export default function DashboardHeader({ role = 'User' }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Home & Profile */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {getInitials(role)}
            </div>
          </div>

          {/* Center: Greeting */}
          <div className="text-center flex-1">
            <h1 className="text-lg font-semibold">
              {greeting}, {role}
            </h1>
          </div>

          {/* Right: Theme Toggle & Demo Badge */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
              Demo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
