import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  school: mongoose.Types.ObjectId;
  title: string;
  description: string;
  subject: string;
  class: string;
  section?: string;
  teacher: mongoose.Types.ObjectId;
  dueDate: Date;
  totalMarks: number;
  attachments?: string[];
  instructions?: string;
  allowLateSubmission: boolean;
  lateSubmissionPenalty?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
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
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    attachments: [{
      type: String,
    }],
    instructions: {
      type: String,
    },
    allowLateSubmission: {
      type: Boolean,
      default: true,
    },
    lateSubmissionPenalty: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AssignmentSchema.index({ school: 1, class: 1, subject: 1 });
AssignmentSchema.index({ teacher: 1 });
AssignmentSchema.index({ dueDate: 1 });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
