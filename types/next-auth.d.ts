import { UserRole } from '@/types/enums';

// Re-export for backward compatibility
export { UserRole };

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
      school: string;
      profilePicture?: string;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    school: string;
    profilePicture?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    school: string;
    profilePicture?: string;
  }
}
