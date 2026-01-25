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
const createUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(100),
  role: z.enum(['SUPER_ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/).optional(),
  section: z.string().max(10).optional(),
  rollNumber: z.string().max(20).optional(),
  subjects: z.array(z.string().max(100)).optional(),
});

const updateUserSchema = z.object({
  userId: z.string().refine(isValidObjectId, 'Invalid user ID'),
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  role: z.enum(['SUPER_ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
  isActive: z.boolean().optional(),
});

// GET - List users
export async function GET(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.read);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || ![UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Only admins can view users' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));

    const query: any = { school: session.user.school };

    if (role && ['SUPER_ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'].includes(role)) {
      query.role = role;
    }

    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      if (sanitizedSearch) {
        query.$or = [
          { name: { $regex: sanitizedSearch, $options: 'i' } },
          { email: { $regex: sanitizedSearch, $options: 'i' } },
        ];
      }
    }

    const users = await User.find(query)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    // Get role counts
    const roleCounts = await User.aggregate([
      { $match: { school: session.user.school } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: { total, byRole: Object.fromEntries(roleCounts.map(r => [r._id, r.count])) },
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/admin/users');
  }
}

// POST - Create user
export async function POST(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || ![UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Only admins can create users' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = createUserSchema.parse(body);

    // Sub-admins cannot create super admins
    if (session.user.role === UserRole.SUB_ADMIN && validated.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Sub-admins cannot create super admins' }, { status: 403 });
    }

    // Check for existing email
    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const user = await User.create({
      school: session.user.school,
      ...validated,
    });

    const userData = user.toObject() as any;
    delete userData.password;

    return NextResponse.json({ success: true, user: userData, message: 'User created successfully' });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/admin/users');
  }
}

// PUT - Update user
export async function PUT(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || ![UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN].includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: 'Only admins can update users' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const validated = updateUserSchema.parse(body);
    const { userId, ...updates } = validated;

    const user = await User.findOneAndUpdate(
      { _id: userId, school: session.user.school },
      updates,
      { new: true, select: '-password -__v' }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/admin/users');
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = await checkRateLimit(req, rateLimitPresets.write);
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck.resetTime);

    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Only super admin can delete users' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId || !isValidObjectId(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const user = await User.findOneAndDelete({
      _id: userId,
      school: session.user.school,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return handleApiError(error, 'DELETE /api/admin/users');
  }
}
