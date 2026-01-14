import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string; // e.g., "Mathematics"
  class: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  assignedTeacher?: mongoose.Types.ObjectId;
  syllabusContent?: string; // Uploaded syllabus text or file URL
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required'],
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    syllabusContent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique subjects per class
SubjectSchema.index({ name: 1, class: 1 }, { unique: true });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
