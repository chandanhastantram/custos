'use client';

import ReflectiveCard from '@/components/ui/reflective-card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArrowRight, BookOpen, Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherProfilePage() {
  const router = useRouter();

  const teacherInfo = {
    name: 'JOHN SMITH',
    role: 'SENIOR TEACHER',
    id: '2021-TCH-0045',
    department: 'Mathematics',
    experience: '8 Years',
    classes: '10A, 10B, 11A',
  };

  const todayStats = [
    { label: 'Classes Today', value: '4', icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Students', value: '120', icon: <Users className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Hours', value: '6h', icon: <Clock className="w-5 h-5" />, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-12 py-8">
      {/* Reflective Card */}
      <div className="flex justify-center">
        <ReflectiveCard
          userName={teacherInfo.name}
          userRole={teacherInfo.role}
          userId={teacherInfo.id}
          securityLabel="FACULTY ID"
          blurStrength={8}
          metalness={0.9}
          roughness={0.25}
          grayscale={0.6}
          overlayColor="rgba(59, 130, 246, 0.1)"
        />
      </div>

      {/* Info Panel */}
      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-3xl font-bold mb-2">Good Morning, Teacher!</h2>
          <p className="text-muted-foreground">Ready for another great day of teaching</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-4">
          {todayStats.map((stat, i) => (
            <div key={i} className="relative rounded-xl border border-border p-1">
              <GlowingEffect spread={20} glow={true} disabled={false} proximity={30} inactiveZone={0.1} borderWidth={2} />
              <div className="relative bg-card rounded-lg p-4 text-center">
                <div className={`mb-2 ${stat.color} flex justify-center`}>{stat.icon}</div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Details */}
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={30} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Faculty Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{teacherInfo.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{teacherInfo.experience}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Assigned Classes</p>
                <p className="font-medium">{teacherInfo.classes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push('/teacher')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
