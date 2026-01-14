import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db';
import User from '@/models/User';
import { UserRole } from '@/types/enums';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          await dbConnect();
          console.log('Database connected');

          const user = await User.findOne({ email: credentials.email })
            .select('+password')
            .populate('school');

          console.log('User found:', user ? user.email : 'No user');

          if (!user) {
            console.log('User not found in database');
            return null;
          }

          // Verify role matches
          if (credentials.role && user.role !== credentials.role) {
            console.log('Role mismatch:', credentials.role, 'vs', user.role);
            return null;
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password as string
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            school: user.school?._id?.toString() || user.school?.toString(),
            profilePicture: user.profilePicture,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.school = user.school;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.school = token.school as string;
        session.user.profilePicture = token.profilePicture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
