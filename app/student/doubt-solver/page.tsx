'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Brain, Send, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function StudentDoubtSolverPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    {
      role: 'ai',
      content: "👋 Hi! I'm CUSTOS AI, your intelligent educational assistant. Ask me anything about your studies, and I'll help you understand it better!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();
    setQuestion('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/solve-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuestion,
          subject: 'General',
          syllabusContent: 'Indian school curriculum',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: data.response
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: 'Sorry, I encountered an error. Please try again or contact your teacher.'
        }]);
      }
    } catch (error) {
      console.error('Doubt solver error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="w-7 h-7 text-blue-500" />
            CUSTOS AI - Doubt Solver
          </h2>
          <p className="text-muted-foreground">Ask me anything about your studies!</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-600/30">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-500">AI Powered</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 relative rounded-2xl border border-border p-1 overflow-hidden">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-muted/50 border border-border'
                  }`}
                >
                  {message.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-500">CUSTOS AI</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-4 bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-xs font-semibold text-blue-500">CUSTOS AI</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything... (e.g., 'Who are you?' or 'How to solve quadratic equations?')"
              className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-600 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Ask
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Try: "Who are you?"</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Or ask about any topic!</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
