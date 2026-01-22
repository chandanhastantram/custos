import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import Transaction from '@/models/Transaction';
import crypto from 'crypto';

// Verify Razorpay payment
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      paymentMethod,
    } = body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Invalid signature - mark payment as failed
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed',
        failureReason: 'Invalid payment signature',
      });

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Signature is valid - update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'completed',
        paymentMethod: paymentMethod || 'card',
        paymentDate: new Date(),
        'razorpay.paymentId': razorpay_payment_id,
        'razorpay.signature': razorpay_signature,
        transactionId: `TXN${Date.now()}`,
      },
      { new: true }
    ).populate('student', 'name email');

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Create transaction record for income
    await Transaction.create({
      school: payment.school,
      type: 'income',
      category: 'tuition_fee', // You can make this dynamic based on fee components
      amount: payment.totalAmount,
      date: new Date(),
      description: `Fee payment from ${payment.student.name}`,
      paymentMethod: payment.paymentMethod,
      status: 'completed',
      relatedUser: payment.student._id,
      relatedPayment: payment._id,
      metadata: {
        feeComponents: payment.feeComponents,
        razorpayPaymentId: razorpay_payment_id,
      },
      createdBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        receiptNumber: payment.receiptNumber,
        amount: payment.totalAmount,
        paymentDate: payment.paymentDate,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
