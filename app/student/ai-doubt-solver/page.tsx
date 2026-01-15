'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { MessageCircle, Send, Sparkles, History, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function AIDoubtSolverPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', content: "Hello! I'm your AI tutor. Ask me anything from your syllabus and I'll help you understand it better. I'm trained specifically on your course material to give you accurate answers." },
  ]);

  const suggestedQuestions = [
    "Explain the concept of fractions",
    "What is Newton's first law?",
    "How do I solve quadratic equations?",
    "Explain photosynthesis in simple terms",
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChat(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'ai', content: `That's a great question about "${message}"! Let me explain...\n\nThis is a placeholder response. In the real implementation, the AI would provide a detailed, syllabus-specific answer based on your course material.` },
    ]);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Doubt Solver</h2>
            <p className="text-muted-foreground">Your personal syllabus-trained tutor</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative flex-1 flex flex-col bg-card rounded-xl overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-muted'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Tutor</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your doubt..."
                  className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          {/* Suggested Questions */}
          <div className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => setMessage(q)}
                    className="w-full text-left p-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Your Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Mathematics', 'Physics', 'Chemistry', 'English', 'History'].map((subj, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm">
                    {subj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
