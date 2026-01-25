'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, Download, TrendingUp, Users, Calendar, Award, FileText } from 'lucide-react';
import { useState } from 'react';
import { downloadReportCardPDF, ReportCardData } from '@/lib/pdf';
import { TrendLineChart, ComparisonBarChart, samplePerformanceData } from '@/components/charts/AnalyticsCharts';

export default function ParentReportsPage() {
  const [selectedChild, setSelectedChild] = useState('Alice');
  const children = ['Alice', 'Bob'];

  const childrenData: Record<string, { 
    subjects: { name: string; score: number; grade: string; rank: number }[], 
    overall: number, 
    rank: number,
    attendance: number,
    className: string,
    section: string
  }> = {
    'Alice': {
      subjects: [
        { name: 'Mathematics', score: 92, grade: 'A+', rank: 3 },
        { name: 'Physics', score: 88, grade: 'A', rank: 5 },
        { name: 'Chemistry', score: 78, grade: 'B+', rank: 12 },
        { name: 'English', score: 85, grade: 'A', rank: 8 },
        { name: 'Hindi', score: 82, grade: 'A', rank: 10 },
      ],
      overall: 86,
      rank: 5,
      attendance: 92,
      className: 'Class 10',
      section: 'A'
    },
    'Bob': {
      subjects: [
        { name: 'Mathematics', score: 75, grade: 'B+', rank: 18 },
        { name: 'Science', score: 82, grade: 'A-', rank: 10 },
        { name: 'English', score: 88, grade: 'A', rank: 6 },
        { name: 'Social Studies', score: 79, grade: 'B+', rank: 15 },
        { name: 'Hindi', score: 85, grade: 'A', rank: 8 },
      ],
      overall: 81,
      rank: 12,
      attendance: 88,
      className: 'Class 7',
      section: 'B'
    }
  };

  const data = childrenData[selectedChild];

  const handleDownloadPDF = () => {
    const reportData: ReportCardData = {
      studentName: selectedChild,
      studentId: selectedChild === 'Alice' ? 'STU2026001' : 'STU2026015',
      className: data.className,
      section: data.section,
      academicYear: '2025-2026',
      schoolName: 'CUSTOS School',
      subjects: data.subjects.map(s => ({
        name: s.name,
        marks: s.score,
        totalMarks: 100,
        grade: s.grade,
        rank: s.rank,
      })),
      attendance: {
        present: Math.round(data.attendance * 2),
        total: 200,
        percentage: data.attendance,
      },
      overallPercentage: data.overall,
      overallGrade: data.overall >= 90 ? 'A+' : data.overall >= 80 ? 'A' : 'B+',
      classRank: data.rank,
      remarks: data.overall >= 80 
        ? 'Excellent performance! Keep up the great work!'
        : 'Good progress. Focus on weaker areas for improvement.',
    };
    downloadReportCardPDF(reportData);
  };

  const subjectChartData = data.subjects.map(s => ({ name: s.name.substring(0, 4), value: s.score }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-400" />
            Academic Reports
          </h2>
          <p className="text-muted-foreground">View your children's academic performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border"
          >
            {children.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Report Card
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {selectedChild.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold">{selectedChild}</p>
              <p className="text-muted-foreground">{data.className} {data.section}</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 text-center">
            <p className="text-3xl font-bold text-green-400">{data.overall}%</p>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 text-center">
            <p className="text-3xl font-bold text-blue-400">#{data.rank}</p>
            <p className="text-sm text-muted-foreground">Class Rank</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-5 text-center">
            <p className="text-3xl font-bold text-orange-400">{data.attendance}%</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Performance Trend
            </h3>
            <TrendLineChart data={samplePerformanceData} height={220} />
          </div>
        </div>

        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Subject Scores
            </h3>
            <ComparisonBarChart data={subjectChartData} height={220} />
          </div>
        </div>
      </div>

      {/* Subject Performance Table */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Subject Performance - {selectedChild}</h3>
          <div className="space-y-4">
            {data.subjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-32 font-medium">{subj.name}</div>
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${subj.score}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-center font-bold">{subj.score}%</div>
                <div className="w-12 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${
                    subj.grade.startsWith('A') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>{subj.grade}</span>
                </div>
                <div className="w-16 text-center text-muted-foreground">#{subj.rank}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            Recent Test Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Math Unit Test', score: '45/50', date: 'Jan 20, 2026', grade: 'A' },
              { name: 'Science Quiz', score: '18/20', date: 'Jan 18, 2026', grade: 'A' },
              { name: 'English Essay', score: '22/25', date: 'Jan 15, 2026', grade: 'A' },
            ].map((test, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-medium">{test.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-blue-400">{test.score}</span>
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm">{test.grade}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{test.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
