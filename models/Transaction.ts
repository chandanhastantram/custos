import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  school: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  relatedUser?: mongoose.Types.ObjectId;
  relatedExpense?: mongoose.Types.ObjectId;
  relatedPayment?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        // Income categories
        'tuition_fee',
        'lab_fee',
        'library_fee',
        'sports_fee',
        'activity_fee',
        'admission_fee',
        'other_income',
        // Expense categories
        'teacher_salary',
        'staff_salary',
        'building_maintenance',
        'utilities',
        'activities',
        'supplies',
        'equipment',
        'other_expense',
      ],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'netbanking', 'cheque', 'bank_transfer'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedExpense: {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
    },
    relatedPayment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TransactionSchema.index({ school: 1, date: -1 });
TransactionSchema.index({ school: 1, type: 1, category: 1 });
TransactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
