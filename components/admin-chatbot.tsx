'use client';

import { Bot, Send, X, Minimize2, Maximize2, Sparkles, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

interface AdminChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminChatbot({ isOpen, onToggle }: AdminChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm CUSTOS AI Admin Assistant. I can help you with:\n\n• Timetable generation and scheduling\n• Teacher & student management\n• Fee management and tracking\n• Reports and analytics\n• Any other school tasks\n\nHow can I help you today?",
      suggestions: ['Generate timetable', 'Add new teacher', 'View reports'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/admin-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            currentPage: pathname,
            recentActions: [],
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          suggestions: data.suggestions || [],
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I can help you with that! Please note: Make sure the GROK_API_KEY is set in your environment variables for full AI functionality. In the meantime, I can guide you through the system:\n\n• Go to "AI Wizard" for timetable generation\n• Use the sidebar for navigation\n• Check Reports for analytics',
          suggestions: ['Go to Timetable Wizard', 'View Reports'],
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I can help you navigate the system! Use the suggestion buttons below or ask me about:\n\n• Creating timetables\n• Managing teachers and students\n• Fee management\n• Viewing reports',
        suggestions: ['Go to Timetable Wizard', 'View Reports', 'Manage Teachers'],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    // Handle navigation suggestions
    if (suggestion === 'Go to Timetable Wizard' || suggestion === 'Generate timetable') {
      router.push('/super-admin/timetable-wizard');
      onToggle();
      return;
    }
    if (suggestion === 'Manage Teachers' || suggestion === 'Add new teacher') {
      router.push('/super-admin/manage/users');
      onToggle();
      return;
    }
    if (suggestion === 'Manage Students') {
      router.push('/super-admin/manage/users');
      onToggle();
      return;
    }
    if (suggestion === 'Fee Management') {
      router.push('/super-admin/money');
      onToggle();
      return;
    }
    if (suggestion === 'View Reports') {
      router.push('/super-admin/reports');
      onToggle();
      return;
    }

    // Otherwise, send as message
    setInput(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <div className="rounded-2xl border-2 border-blue-500 h-full shadow-2xl bg-white dark:bg-gray-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                CUSTOS AI
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </h3>
              <p className="text-xs text-blue-100">Admin Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-blue-700 rounded-lg text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-blue-700 rounded-lg text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[340px] bg-gray-50 dark:bg-gray-800">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CUSTOS AI</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestion(suggestion)}
                            className="text-xs px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1 font-medium"
                          >
                            {suggestion}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span className="text-xs font-semibold text-blue-600">CUSTOS AI</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Floating Trigger Button
export function AdminChatbotTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 hover:bg-blue-700 transition-all flex items-center justify-center group"
    >
      <Bot className="w-6 h-6" />
      <span className="absolute right-full mr-3 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-gray-900 dark:text-white shadow-lg">
        CUSTOS AI Assistant
      </span>
    </button>
  );
}
