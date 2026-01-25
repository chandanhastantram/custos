'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Trophy, TrendingUp, Star, Download, BookOpen, Calendar, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { downloadReportCardPDF, generateSampleReportCard } from '@/lib/pdf';
import { TrendLineChart, ComparisonBarChart, DistributionPieChart, samplePerformanceData, sampleSubjectData, sampleAttendanceData } from '@/components/charts/AnalyticsCharts';

export default function StudentReportsPage() {
  const subjects = [
    { name: 'Mathematics', score: 92, grade: 'A+', rank: 3, trend: 'up' },
    { name: 'Physics', score: 88, grade: 'A', rank: 5, trend: 'up' },
    { name: 'Chemistry', score: 78, grade: 'B+', rank: 12, trend: 'down' },
    { name: 'English', score: 85, grade: 'A', rank: 8, trend: 'up' },
    { name: 'History', score: 90, grade: 'A+', rank: 4, trend: 'same' },
  ];

  const handleDownloadPDF = () => {
    const reportData = generateSampleReportCard('Chandan Kumar');
    downloadReportCardPDF(reportData);
  };

  const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
  const avgScore = (totalScore / subjects.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-400" />
            My Reports
          </h2>
          <p className="text-muted-foreground">View your academic performance and analytics</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Report Card
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Average Score</p>
                <p className="text-2xl font-bold text-green-400">{avgScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Class Rank</p>
                <p className="text-2xl font-bold text-blue-400">#5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Attendance</p>
                <p className="text-2xl font-bold text-blue-400">87.5%</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tests Taken</p>
                <p className="text-2xl font-bold text-orange-400">24</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Performance Trend
            </h3>
            <TrendLineChart data={samplePerformanceData} height={250} />
          </div>
        </div>

        {/* Subject-wise Scores */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Subject-wise Scores
            </h3>
            <ComparisonBarChart data={sampleSubjectData} height={250} />
          </div>
        </div>
      </div>

      {/* Attendance Distribution & Subject Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Pie Chart */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Attendance
            </h3>
            <DistributionPieChart data={sampleAttendanceData} height={200} />
          </div>
        </div>

        {/* Subject Details Table */}
        <div className="relative rounded-2xl border border-border p-1 md:col-span-2">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
            <div className="space-y-3">
              {subjects.map((subject, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium">{subject.name}</p>
                    <div className="w-full h-2 bg-muted rounded-full mt-1">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-16">
                    <p className="font-bold">{subject.score}%</p>
                    <p className="text-xs text-muted-foreground">{subject.grade}</p>
                  </div>
                  <div className="w-12 text-center">
                    <span className="text-sm text-muted-foreground">#{subject.rank}</span>
                  </div>
                  <div className="w-8">
                    {subject.trend === 'up' && <ChevronUp className="w-5 h-5 text-green-400" />}
                    {subject.trend === 'down' && <ChevronDown className="w-5 h-5 text-red-400" />}
                    {subject.trend === 'same' && <span className="text-muted-foreground">—</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Test Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Math Chapter 5 Test', score: '18/20', percentage: 90, date: 'Jan 20, 2026' },
              { name: 'Physics Quiz', score: '9/10', percentage: 90, date: 'Jan 18, 2026' },
              { name: 'English Essay', score: '42/50', percentage: 84, date: 'Jan 15, 2026' },
            ].map((test, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-medium">{test.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold text-blue-400">{test.score}</span>
                  <span className={`px-2 py-1 rounded text-sm ${test.percentage >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {test.percentage}%
                  </span>
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
