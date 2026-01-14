'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Profile Icon */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {session?.user?.profilePicture ? (
                <img
                  src={session.user.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(session?.user?.name || 'U')
              )}
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center flex-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {greeting}, {session?.user?.name}
            </h1>
          </div>

          {/* Navigation Dropdown */}
          <div className="relative">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer">
              <option value="">Navigate</option>
              <option value="manage">Manage</option>
              <option value="reports">Reports</option>
              <option value="calendar">Calendar</option>
              <option value="post">Post</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
