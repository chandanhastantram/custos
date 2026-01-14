import mongoose, { Schema, Document, Model } from 'mongoose';
import { EventType } from '@/types/enums';

export interface IEvent extends Document {
  school: mongoose.Types.ObjectId;
  
  type: EventType;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  
  // Daily schedule details (for regular teaching days)
  dailySchedule?: {
    date: Date;
    class: mongoose.Types.ObjectId;
    section: string;
    periods: {
      periodNumber: number;
      subject: mongoose.Types.ObjectId;
      teacher: mongoose.Types.ObjectId;
      startTime: string; // e.g., "09:00"
      endTime: string; // e.g., "09:45"
    }[];
  }[];
  
  // Exam schedule details
  examSchedule?: {
    date: Date;
    subject: mongoose.Types.ObjectId;
    class: mongoose.Types.ObjectId;
    invigilator: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
    startTime: string;
    endTime: string;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    dailySchedule: [
      {
        date: Date,
        class: { type: Schema.Types.ObjectId, ref: 'Class' },
        section: String,
        periods: [
          {
            periodNumber: Number,
            subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
            teacher: { type: Schema.Types.ObjectId, ref: 'User' },
            startTime: String,
            endTime: String,
          },
        ],
      },
    ],
    examSchedule: [
      {
        date: Date,
        subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
        class: { type: Schema.Types.ObjectId, ref: 'Class' },
        invigilator: { type: Schema.Types.ObjectId, ref: 'User' },
        students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        startTime: String,
        endTime: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
