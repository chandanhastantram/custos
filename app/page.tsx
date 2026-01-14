'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types/enums';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        [UserRole.SUPER_ADMIN]: '/super-admin',
        [UserRole.SUB_ADMIN]: '/sub-admin',
        [UserRole.TEACHER]: '/teacher',
        [UserRole.STUDENT]: '/student',
        [UserRole.PARENT]: '/parent',
      };
      router.push(roleRoutes[session.user.role] || '/login');
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
