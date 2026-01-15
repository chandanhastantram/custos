'use client';

import ReflectiveCard from '@/components/ui/reflective-card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentProfilePage() {
  const router = useRouter();

  const studentInfo = {
    name: 'ALICE JOHNSON',
    role: 'CLASS 10A STUDENT',
    id: '2026-STU-0015',
    class: '10A',
    section: 'A',
    rollNo: '15',
    house: 'Blue',
  };

  const quickStats = [
    { label: 'Attendance', value: '95%', color: 'text-green-400' },
    { label: 'Overall Grade', value: 'A', color: 'text-blue-400' },
    { label: 'Points', value: '2,450', color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-12 py-8">
      {/* Reflective Card */}
      <div className="flex justify-center">
        <ReflectiveCard
          userName={studentInfo.name}
          userRole={studentInfo.role}
          userId={studentInfo.id}
          securityLabel="STUDENT ID"
          blurStrength={10}
          metalness={0.8}
          roughness={0.3}
          grayscale={0.8}
        />
      </div>

      {/* Info Panel */}
      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Your personalized student dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, i) => (
            <div key={i} className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={20} glow={true} disabled={false} proximity={30} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details */}
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Student Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="font-medium">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Section</p>
                <p className="font-medium">{studentInfo.section}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-medium">{studentInfo.rollNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">House</p>
                <p className="font-medium">{studentInfo.house}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push('/student')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
