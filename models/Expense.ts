import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  school: mongoose.Types.ObjectId;
  category: string;
  subcategory?: string;
  amount: number;
  date: Date;
  description: string;
  recipient?: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  attachments?: string[];
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  notes?: string;
  recurring?: {
    enabled: boolean;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    nextDate?: Date;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'teacher_salary',
        'staff_salary',
        'building_maintenance',
        'utilities',
        'activities',
        'supplies',
        'equipment',
        'transportation',
        'marketing',
        'other',
      ],
    },
    subcategory: {
      type: String,
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
    recipient: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash', 'upi', 'card', 'netbanking', 'cheque', 'bank_transfer'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
    },
    attachments: [{
      type: String,
    }],
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    recurring: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
      },
      nextDate: {
        type: Date,
      },
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

// Indexes
ExpenseSchema.index({ school: 1, date: -1 });
ExpenseSchema.index({ school: 1, category: 1 });
ExpenseSchema.index({ status: 1 });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
