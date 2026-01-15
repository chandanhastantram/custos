'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Megaphone, Plus, Image, FileText, Calendar, Edit2, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const posts = [
    { id: 1, title: 'Annual Sports Day Announcement', type: 'announcement', date: 'Jan 15, 2026', views: 245, status: 'published' },
    { id: 2, title: 'Republic Day Celebrations', type: 'event', date: 'Jan 14, 2026', views: 189, status: 'published' },
    { id: 3, title: 'Mid-Term Exam Schedule', type: 'notice', date: 'Jan 12, 2026', views: 567, status: 'published' },
    { id: 4, title: 'Parent-Teacher Meeting', type: 'announcement', date: 'Jan 10, 2026', views: 423, status: 'published' },
    { id: 5, title: 'Science Exhibition Photos', type: 'gallery', date: 'Jan 8, 2026', views: 312, status: 'draft' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="w-5 h-5" />;
      case 'gallery': return <Image className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-500/20 text-blue-400';
      case 'gallery': return 'bg-purple-500/20 text-purple-400';
      case 'event': return 'bg-green-500/20 text-green-400';
      default: return 'bg-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Megaphone className="w-7 h-7" />
            Posts & Announcements
          </h2>
          <p className="text-muted-foreground">Create and manage school announcements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {['all', 'announcements', 'events', 'gallery', 'drafts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-colors capitalize ${
              activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Post</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Views</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{post.title}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getTypeColor(post.type)}`}>
                      {getTypeIcon(post.type)}
                      {post.type}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{post.date}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      {post.views}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded hover:bg-muted transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-muted text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
