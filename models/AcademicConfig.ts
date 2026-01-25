import mongoose, { Schema, Document, Model } from 'mongoose';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface IPeriodConfig {
  periodNumber: number;
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  type: 'regular' | 'break' | 'lunch' | 'assembly';
  name?: string; // "Period 1" or "Lunch Break"
}

export interface IHoliday {
  date: Date;
  name: string;
  type: 'national' | 'school' | 'exam' | 'vacation';
}

export interface ISubjectHours {
  subject: mongoose.Types.ObjectId;
  hoursPerWeek: number;
}

export interface IAcademicConfig extends Document {
  school: mongoose.Types.ObjectId;
  academicYear: string; // "2026-2027"
  name: string; // "Academic Year 2026-2027"
  
  // Working days configuration
  workingDays: DayOfWeek[];
  
  // Period configuration
  periodsPerDay: number;
  periods: IPeriodConfig[];
  
  // Subject hours allocation
  subjectHoursPerWeek: ISubjectHours[];
  
  // Holidays
  holidays: IHoliday[];
  
  // School timings
  schoolStartTime: string; // "08:00"
  schoolEndTime: string; // "15:00"
  
  // AI generation settings
  lastGeneratedAt?: Date;
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed';
  
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicConfigSchema = new Schema<IAcademicConfig>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Configuration name is required'],
      trim: true,
    },
    workingDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    periodsPerDay: {
      type: Number,
      default: 8,
      min: 4,
      max: 12,
    },
    periods: [
      {
        periodNumber: { type: Number, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        type: {
          type: String,
          enum: ['regular', 'break', 'lunch', 'assembly'],
          default: 'regular',
        },
        name: { type: String },
      },
    ],
    subjectHoursPerWeek: [
      {
        subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
        hoursPerWeek: { type: Number, default: 4 },
      },
    ],
    holidays: [
      {
        date: { type: Date, required: true },
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ['national', 'school', 'exam', 'vacation'],
          default: 'school',
        },
      },
    ],
    schoolStartTime: {
      type: String,
      default: '08:00',
    },
    schoolEndTime: {
      type: String,
      default: '15:00',
    },
    lastGeneratedAt: {
      type: Date,
    },
    generationStatus: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique active config per school-year
AcademicConfigSchema.index({ school: 1, academicYear: 1 }, { unique: true });

const AcademicConfig: Model<IAcademicConfig> =
  mongoose.models.AcademicConfig || mongoose.model<IAcademicConfig>('AcademicConfig', AcademicConfigSchema);

export default AcademicConfig;
