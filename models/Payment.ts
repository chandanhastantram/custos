import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  school: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  feeComponents: Array<{
    feeType: string;
    amount: number;
    quarter?: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  razorpay?: {
    orderId: string;
    paymentId?: string;
    signature?: string;
  };
  transactionId?: string;
  receiptNumber?: string;
  paymentDate?: Date;
  failureReason?: string;
  refund?: {
    amount: number;
    reason: string;
    refundedAt: Date;
    refundId: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feeComponents: [
      {
        feeType: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        quarter: {
          type: String,
          enum: ['Q1', 'Q2', 'Q3', 'Q4'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'cash'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpay: {
      orderId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      signature: {
        type: String,
      },
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDate: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    refund: {
      amount: Number,
      reason: String,
      refundedAt: Date,
      refundId: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ school: 1, student: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ 'razorpay.orderId': 1 });
PaymentSchema.index({ 'razorpay.paymentId': 1 });
// Note: receiptNumber already has unique: true in schema definition

// Generate receipt number before saving
PaymentSchema.pre('save', async function () {
  if (!this.receiptNumber && this.status === 'completed') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.receiptNumber = `RCP${year}${month}${random}`;
  }
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
