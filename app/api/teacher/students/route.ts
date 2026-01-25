import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { UserRole } from '@/types/enums';
import { checkRateLimit, rateLimitResponse, rateLimitPresets } from '@/lib/rate-limit';
import { sanitizeSearchQuery, isValidObjectId } from '@/lib/sanitize';
import { handleApiError } from '@/lib/api-helpers';

// Validation schemas
const createStudentSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(100),
  rollNumber: z.string().min(2).max(20).trim(),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/),
  section: z.string().max(10).optional(),
  parentName: z.string().max(100).optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentPhone: z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().max(500).optional(),
});

const updateStudentSchema = z.object({
  studentId: z.string().refine(isValidObjectId, 'Invalid student ID'),
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  rollNumber: z.string().min(2).max(20).trim().optional(),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/).optional(),
  section: z.string().max(10).optional(),
  parentName: z.string().max(100).optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});

// GET - List students with security
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetTime);
    }

    const session = await auth();
    
    if (!session?.user || ![UserRole.TEACHER, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));

    const query: any = {
      school: session.user.school,
      role: UserRole.STUDENT,
    };

    // Validate and apply class filter
    if (className && /^[0-9]{1,2}[A-Z]?$/.test(className)) {
      query.class = className;
    }
    if (section && section.length <= 10) {
      query.section = section;
    }

    // Sanitize search query to prevent NoSQL injection
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      if (sanitizedSearch) {
        query.$or = [
          { name: { $regex: sanitizedSearch, $options: 'i' } },
          { email: { $regex: sanitizedSearch, $options: 'i' } },
          { rollNumber: { $regex: sanitizedSearch, $options: 'i' } },
        ];
      }
    }

    const students = await User.find(query)
      .select('-password -__v')
      .sort({ class: 1, rollNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      students,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/teacher/students');
  }
}

// POST - Add new student with validation
export async function POST(req: NextRequest) {
  try {
    // Rate limiting for write operations
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetTime);
    }

    const session = await auth();
    
    if (!session?.user || ![UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Only admins can add students' }, { status: 403 });
    }

    await dbConnect();

    // Validate input
    const body = await req.json();
    const validated = createStudentSchema.parse(body);

    // Check for duplicates
    const existingUser = await User.findOne({
      school: session.user.school,
      $or: [{ email: validated.email }, { rollNumber: validated.rollNumber }],
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email or roll number already exists' }, { status: 400 });
    }

    const student = await User.create({
      school: session.user.school,
      role: UserRole.STUDENT,
      ...validated,
    });

    const studentData = student.toObject() as any;
    delete studentData.password;

    return NextResponse.json({
      success: true,
      student: studentData,
      message: 'Student added successfully',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/teacher/students');
  }
}

// PUT - Update student with validation
export async function PUT(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetTime);
    }

    const session = await auth();
    
    if (!session?.user || ![UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Only admins can update students' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = updateStudentSchema.parse(body);
    const { studentId, ...updates } = validated;

    const student = await User.findOneAndUpdate(
      { _id: studentId, school: session.user.school, role: UserRole.STUDENT },
      updates,
      { new: true, select: '-password -__v' }
    );

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/teacher/students');
  }
}

// DELETE - Remove student
export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetTime);
    }

    const session = await auth();
    
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Only super admin can delete students' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('id');

    if (!studentId || !isValidObjectId(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    const student = await User.findOneAndDelete({
      _id: studentId,
      school: session.user.school,
      role: UserRole.STUDENT,
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error: any) {
    return handleApiError(error, 'DELETE /api/teacher/students');
  }
}
