import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimetable extends Document {
  name: string; // e.g., "Class 10A - 2026 Spring"
  class: mongoose.Types.ObjectId;
  section: string;
  school: mongoose.Types.ObjectId;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    name: {
      type: String,
      required: [true, 'Timetable name is required'],
      trim: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
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

// Compound index for unique active timetable per class-section
TimetableSchema.index({ class: 1, section: 1, school: 1, isActive: 1 });

const Timetable: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema);

export default Timetable;
