'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BookOpen, ChevronRight, Download } from 'lucide-react';

export default function SubAdminSyllabusPage() {
  const subjects = [
    { name: 'Mathematics', chapters: 15, completion: 60 },
    { name: 'Physics', chapters: 12, completion: 45 },
    { name: 'Chemistry', chapters: 14, completion: 50 },
    { name: 'English', chapters: 8, completion: 80 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          Syllabus
        </h2>
        <p className="text-muted-foreground">View syllabus and curriculum</p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{subject.chapters} Chapters</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{subject.completion}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${subject.completion}%` }} />
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Download */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Download Syllabus</h3>
            <p className="text-sm text-muted-foreground">Get the complete syllabus PDF</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
