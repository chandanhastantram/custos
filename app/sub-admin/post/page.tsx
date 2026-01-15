'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Megaphone, Plus, Image, FileText, Edit2, Trash2 } from 'lucide-react';

export default function SubAdminPostsPage() {
  const posts = [
    { id: 1, title: 'Class 10 Exam Schedule', type: 'notice', date: 'Jan 15, 2026', status: 'published' },
    { id: 2, title: 'Sports Day Registration', type: 'announcement', date: 'Jan 14, 2026', status: 'published' },
    { id: 3, title: 'Library Timings Update', type: 'notice', date: 'Jan 12, 2026', status: 'draft' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Megaphone className="w-7 h-7" />
            Posts
          </h2>
          <p className="text-muted-foreground">Create and manage announcements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Posts List */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {post.status}
                </span>
                <button className="p-2 rounded hover:bg-background"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 rounded hover:bg-background text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
