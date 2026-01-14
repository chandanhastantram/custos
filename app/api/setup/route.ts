import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';
import User, { UserRole } from '@/models/User';

export const runtime = 'nodejs';

/**
 * Database Setup Script
 * 
 * This API route initializes the database with:
 * - A demo school
 * - One user of each role for testing
 * 
 * Access: http://localhost:3000/api/setup
 */

export async function GET() {
  try {
    await dbConnect();

    // Create demo school
    let school = await School.findOne({ name: 'Demo School' });
    
    if (!school) {
      school = await School.create({
        name: 'Demo School',
        primaryColor: '#3B82F6',
        logo: '',
      });
      console.log('✅ Demo school created');
    } else {
      console.log('ℹ️ Demo school already exists');
    }

    // Create demo users
    const demoUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@demo.com',
        password: 'password123',
        role: UserRole.SUPER_ADMIN,
        school: school._id,
      },
      {
        name: 'Sub Admin',
        email: 'subadmin@demo.com',
        password: 'password123',
        role: UserRole.SUB_ADMIN,
        school: school._id,
      },
      {
        name: 'John Teacher',
        email: 'teacher@demo.com',
        password: 'password123',
        role: UserRole.TEACHER,
        school: school._id,
      },
      {
        name: 'Alice Student',
        email: 'student@demo.com',
        password: 'password123',
        role: UserRole.STUDENT,
        school: school._id,
      },
      {
        name: 'Parent Smith',
        email: 'parent@demo.com',
        password: 'password123',
        role: UserRole.PARENT,
        school: school._id,
      },
    ];

    const createdUsers = [];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push({
          name: user.name,
          email: user.email,
          role: user.role,
        });
        console.log(`✅ Created ${user.role}: ${user.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      school: {
        name: school.name,
        primaryColor: school.primaryColor,
      },
      users: createdUsers.length > 0 ? createdUsers : 'All users already exist',
      credentials: {
        note: 'Use these credentials to login',
        superAdmin: { email: 'superadmin@demo.com', password: 'password123' },
        subAdmin: { email: 'subadmin@demo.com', password: 'password123' },
        teacher: { email: 'teacher@demo.com', password: 'password123' },
        student: { email: 'student@demo.com', password: 'password123' },
        parent: { email: 'parent@demo.com', password: 'password123' },
      },
    });
  } catch (error: any) {
    console.error('❌ Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
