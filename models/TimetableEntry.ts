import mongoose, { Schema, Document, Model } from 'mongoose';

export type PeriodType = 'regular' | 'lab' | 'activity';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ITimetableEntry extends Document {
  timetable: mongoose.Types.ObjectId;
  day: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  room?: string;
  type: PeriodType;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableEntrySchema = new Schema<ITimetableEntry>(
  {
    timetable: {
      type: Schema.Types.ObjectId,
      ref: 'Timetable',
      required: [true, 'Timetable reference is required'],
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: [true, 'Day is required'],
    },
    periodNumber: {
      type: Number,
      required: [true, 'Period number is required'],
      min: 1,
      max: 10,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)'],
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    room: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['regular', 'lab', 'activity'],
      default: 'regular',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique period per timetable-day-period
TimetableEntrySchema.index({ timetable: 1, day: 1, periodNumber: 1 }, { unique: true });

// Index for looking up entries by timetable
TimetableEntrySchema.index({ timetable: 1 });

const TimetableEntry: Model<ITimetableEntry> =
  mongoose.models.TimetableEntry ||
  mongoose.model<ITimetableEntry>('TimetableEntry', TimetableEntrySchema);

export default TimetableEntry;
