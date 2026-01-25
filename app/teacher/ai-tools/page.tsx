'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Brain, Sparkles, FileText, MessageCircle, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherAIToolsPage() {
  const router = useRouter();

  const tools = [
    {
      name: 'Lesson Plan Generator',
      description: 'Generate detailed lesson plans from syllabus topics using AI',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      href: '/teacher/lesson-plan'
    },
    {
      name: 'Question Generator',
      description: 'Create MCQs, short answer, and theory questions automatically',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'from-blue-600 to-blue-500',
      href: '/teacher/ai-tools/questions'
    },
    {
      name: 'Smart Grading',
      description: 'AI-assisted grading for subjective answers with feedback',
      icon: <Wand2 className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      href: '/teacher/ai-tools/grading'
    },
    {
      name: 'Weak Topic Analysis',
      description: 'Identify student weak areas and get improvement suggestions',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      href: '/teacher/ai-tools/analysis'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Sparkles className="w-7 h-7" />
          AI Tools
        </h2>
        <p className="text-muted-foreground">AI-powered teaching assistants to help you work smarter</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, i) => (
          <div 
            key={i} 
            onClick={() => router.push(tool.href)}
            className="relative rounded-2xl border border-border p-1 cursor-pointer"
          >
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6 hover:bg-muted/30 transition-colors">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-4`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground">{tool.description}</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm">
                Launch Tool →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Info Banner */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Powered by Advanced AI</h3>
              <p className="text-muted-foreground">All tools are trained on your school's curriculum for accurate, syllabus-bound results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
