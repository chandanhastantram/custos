'use server';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserRole } from '@/types/enums';

// GET teacher by register number
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const registerNumber = searchParams.get('registerNumber');

    if (!registerNumber) {
      return NextResponse.json(
        { success: false, error: 'Register number is required' },
        { status: 400 }
      );
    }

    const teacher = await User.findOne({
      registerNumber: registerNumber.toUpperCase(),
      role: UserRole.TEACHER,
    })
      .select('name email registerNumber subjects')
      .populate('subjects', 'name');

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found with this register number' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        registerNumber: teacher.registerNumber,
        subjects: teacher.subjects,
      },
    });
  } catch (error: any) {
    console.error('Teacher lookup API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to lookup teacher' },
      { status: 500 }
    );
  }
}
