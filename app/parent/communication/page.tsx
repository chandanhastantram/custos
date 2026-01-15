'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { MessageCircle, Send, User, Clock, Search } from 'lucide-react';
import { useState } from 'react';

export default function ParentCommunicationPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const teachers = [
    { name: 'Mr. Smith', subject: 'Mathematics', lastMessage: '2 days ago', unread: 0 },
    { name: 'Ms. Johnson', subject: 'English', lastMessage: '1 week ago', unread: 2 },
    { name: 'Mr. Brown', subject: 'Physics', lastMessage: 'Never', unread: 0 },
    { name: 'Ms. Davis', subject: 'Chemistry', lastMessage: '3 days ago', unread: 0 },
  ];

  const messages = [
    { from: 'teacher', text: 'Hello! I wanted to discuss Alice\'s progress in Math.', time: '10:30 AM' },
    { from: 'parent', text: 'Sure, please let me know how she is doing.', time: '10:32 AM' },
    { from: 'teacher', text: 'She has been performing well in class tests. Keep up the practice!', time: '10:35 AM' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageCircle className="w-7 h-7" />
          Communication
        </h2>
        <p className="text-muted-foreground">Message your children&apos;s teachers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Teachers List */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-4 h-full flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teachers..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {teachers.map((teacher, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTeacher(teacher.name)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTeacher === teacher.name ? 'bg-blue-500/20 border border-blue-500' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                    </div>
                    {teacher.unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs">{teacher.unread}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl h-full flex flex-col">
            {selectedTeacher ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                    {selectedTeacher.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedTeacher}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'parent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.from === 'parent' ? 'bg-blue-500 text-white' : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === 'parent' ? 'text-blue-200' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                    />
                    <button className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a teacher to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
