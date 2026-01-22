import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import Transaction from '@/models/Transaction';
import { UserRole } from '@/types/enums';

// GET - Fetch expenses
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = { school: session.user.school };

    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .limit(100);

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    console.error('Fetch expenses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create expense
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const {
      category,
      subcategory,
      amount,
      date,
      description,
      recipient,
      paymentMethod,
      notes,
      recurring,
    } = body;

    // Validate required fields
    if (!category || !amount || !description || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create expense
    const expense = await Expense.create({
      school: session.user.school,
      category,
      subcategory,
      amount,
      date: date || new Date(),
      description,
      recipient,
      paymentMethod,
      status: 'approved', // Auto-approve for super admin
      approvedBy: session.user.id,
      approvedAt: new Date(),
      notes,
      recurring,
      createdBy: session.user.id,
    });

    // Create transaction record
    await Transaction.create({
      school: session.user.school,
      type: 'expense',
      category,
      amount,
      date: date || new Date(),
      description,
      paymentMethod,
      status: 'completed',
      relatedExpense: expense._id,
      metadata: {
        recipient,
        subcategory,
      },
      createdBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update expense
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { expenseId, ...updates } = body;

    if (!expenseId) {
      return NextResponse.json(
        { error: 'Expense ID required' },
        { status: 400 }
      );
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, school: session.user.school },
      updates,
      { new: true }
    );

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const expenseId = searchParams.get('id');

    if (!expenseId) {
      return NextResponse.json(
        { error: 'Expense ID required' },
        { status: 400 }
      );
    }

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      school: session.user.school,
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
