'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BarChart3, TrendingUp, Users, GraduationCap, BookOpen, Download, PieChart, Calendar, DollarSign } from 'lucide-react';
import { TrendLineChart, ComparisonBarChart, DistributionPieChart, MultiLineChart } from '@/components/charts/AnalyticsCharts';

export default function ReportsPage() {
  const stats = [
    { label: 'Total Students', value: '1,234', trend: '+45', icon: <GraduationCap className="w-5 h-5" />, color: 'blue' },
    { label: 'Overall Attendance', value: '94.2%', trend: '+2.1%', icon: <Calendar className="w-5 h-5" />, color: 'green' },
    { label: 'Average Score', value: '78.5%', trend: '+5.3%', icon: <TrendingUp className="w-5 h-5" />, color: 'orange' },
    { label: 'Fee Collection', value: '₹12.5L', trend: '+₹2.1L', icon: <DollarSign className="w-5 h-5" />, color: 'emerald' },
  ];

  const performanceData = [
    { name: 'Aug', value: 72 },
    { name: 'Sep', value: 75 },
    { name: 'Oct', value: 78 },
    { name: 'Nov', value: 76 },
    { name: 'Dec', value: 82 },
    { name: 'Jan', value: 85 },
  ];

  const classWiseData = [
    { name: '10A', value: 88 },
    { name: '10B', value: 82 },
    { name: '9A', value: 85 },
    { name: '9B', value: 79 },
    { name: '8A', value: 81 },
    { name: '8B', value: 77 },
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 1160 },
    { name: 'Absent', value: 50 },
    { name: 'Leave', value: 24 },
  ];

  const subjectComparison = [
    { name: 'Oct', math: 75, science: 72, english: 78 },
    { name: 'Nov', math: 78, science: 75, english: 80 },
    { name: 'Dec', math: 82, science: 78, english: 82 },
    { name: 'Jan', math: 85, science: 82, english: 85 },
  ];

  const topPerformers = [
    { name: 'Class 10A', subject: 'Mathematics', score: 92, teacher: 'Mr. Sharma' },
    { name: 'Class 9B', subject: 'Science', score: 88, teacher: 'Ms. Patel' },
    { name: 'Class 11A', subject: 'Physics', score: 85, teacher: 'Dr. Kumar' },
    { name: 'Class 8A', subject: 'English', score: 82, teacher: 'Mrs. Singh' },
  ];

  const handleExport = () => {
    // Generate CSV export
    const csvContent = `Class,Subject,Score,Teacher
${topPerformers.map(p => `${p.name},${p.subject},${p.score}%,${p.teacher}`).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-400" />
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground">Comprehensive insights across the school</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="relative rounded-xl border border-border p-1">
            <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
            <div className="relative bg-card rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              School Performance Trend
            </h3>
            <TrendLineChart data={performanceData} height={250} />
          </div>
        </div>

        {/* Class-wise Performance */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Class-wise Average Scores
            </h3>
            <ComparisonBarChart data={classWiseData} height={250} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Distribution */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-400" />
              Today's Attendance
            </h3>
            <DistributionPieChart data={attendanceDistribution} height={220} />
          </div>
        </div>

        {/* Subject Comparison */}
        <div className="relative rounded-2xl border border-border p-1 lg:col-span-2">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Subject Performance Comparison
            </h3>
            <MultiLineChart 
              data={subjectComparison} 
              height={220}
              lines={[
                { dataKey: 'math', color: '#3b82f6', name: 'Mathematics' },
                { dataKey: 'science', color: '#22c55e', name: 'Science' },
                { dataKey: 'english', color: '#f59e0b', name: 'English' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-yellow-400" />
            Top Performing Classes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Class</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Subject</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Teacher</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((item, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        i === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        i === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                        i === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{item.name}</td>
                    <td className="py-4 px-4">{item.subject}</td>
                    <td className="py-4 px-4 text-muted-foreground">{item.teacher}</td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-bold">{item.score}%</span>
                    </td>
                    <td className="py-4 px-4 w-32">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
