import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeComponent {
  type: string;
  amount: number;
  dueDate?: Date;
  quarter?: string;
  mandatory: boolean;
}

export interface IFeeStructure extends Document {
  school: mongoose.Types.ObjectId;
  academicYear: string;
  class: string;
  section?: string;
  components: IFeeComponent[];
  totalAnnual: number;
  installments?: {
    count: number;
    schedule: Array<{
      installmentNumber: number;
      dueDate: Date;
      amount: number;
      components: string[];
    }>;
  };
  lateFee?: {
    enabled: boolean;
    amount: number;
    gracePeriosDays: number;
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    reason?: string;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    section: {
      type: String,
    },
    components: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            'tuition_fee',
            'lab_fee',
            'library_fee',
            'sports_fee',
            'activity_fee',
            'transport_fee',
            'exam_fee',
            'admission_fee',
            'other',
          ],
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        dueDate: {
          type: Date,
        },
        quarter: {
          type: String,
          enum: ['Q1', 'Q2', 'Q3', 'Q4'],
        },
        mandatory: {
          type: Boolean,
          default: true,
        },
      },
    ],
    totalAnnual: {
      type: Number,
      required: true,
      min: 0,
    },
    installments: {
      count: {
        type: Number,
        min: 1,
        max: 12,
      },
      schedule: [
        {
          installmentNumber: Number,
          dueDate: Date,
          amount: Number,
          components: [String],
        },
      ],
    },
    lateFee: {
      enabled: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        min: 0,
      },
      gracePeriosDays: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: {
        type: Number,
        min: 0,
      },
      reason: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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
FeeStructureSchema.index({ school: 1, academicYear: 1, class: 1 });
FeeStructureSchema.index({ isActive: 1 });

export default mongoose.models.FeeStructure || mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
