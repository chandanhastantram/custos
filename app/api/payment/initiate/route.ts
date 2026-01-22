import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import crypto from 'crypto';

// Initialize Razorpay order
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { studentId, feeComponents, totalAmount } = body;

    // Validate input
    if (!studentId || !feeComponents || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for Razorpay credentials
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const razorpayOrderUrl = 'https://api.razorpay.com/v1/orders';
    const authHeader = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');

    const orderResponse = await fetch(razorpayOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          studentId,
          paidBy: session.user.id,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Razorpay order creation failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();

    // Create payment record in database
    const payment = await Payment.create({
      school: session.user.school,
      student: studentId,
      paidBy: session.user.id,
      feeComponents,
      totalAmount,
      paymentMethod: 'pending', // Will be updated after payment
      status: 'pending',
      razorpay: {
        orderId: orderData.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      amount: totalAmount,
      currency: 'INR',
      keyId: razorpayKeyId,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
