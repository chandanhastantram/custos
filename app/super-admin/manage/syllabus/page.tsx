'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BookOpen, Plus, Edit2, Trash2, ChevronRight, FileText, Download } from 'lucide-react';
import { useState } from 'react';

export default function SyllabusPage() {
  const [selectedClass, setSelectedClass] = useState('10');

  const classes = ['10', '9', '8', '7', '6'];

  const subjects = [
    { name: 'Mathematics', chapters: 15, completion: 60, teacher: 'Mr. Smith' },
    { name: 'Physics', chapters: 12, completion: 45, teacher: 'Mr. Brown' },
    { name: 'Chemistry', chapters: 14, completion: 50, teacher: 'Ms. Davis' },
    { name: 'Biology', chapters: 10, completion: 70, teacher: 'Ms. Green' },
    { name: 'English', chapters: 8, completion: 80, teacher: 'Ms. Johnson' },
    { name: 'History', chapters: 10, completion: 55, teacher: 'Mr. Wilson' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            Syllabus Management
          </h2>
          <p className="text-muted-foreground">Manage curriculum and syllabus for all classes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {/* Class Tabs */}
      <div className="flex gap-2">
        {classes.map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedClass === cls ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded hover:bg-muted transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded hover:bg-muted text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{subject.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Teacher: {subject.teacher}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{subject.chapters} Chapters</span>
                  <span>{subject.completion}% Complete</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${subject.completion}%` }}
                  />
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">
                View Chapters <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Download Section */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Download Complete Syllabus</h3>
            <p className="text-sm text-muted-foreground">Get the full syllabus PDF for Class {selectedClass}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
