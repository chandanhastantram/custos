import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  student: mongoose.Types.ObjectId;
  test?: mongoose.Types.ObjectId;
  assignment?: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  submissionType: 'Test' | 'Assignment';
  
  // Answers array
  answers: {
    questionId: string;
    questionText?: string;
    studentAnswer?: string;
    isCorrect?: boolean;
    marksObtained?: number;
    maxMarks?: number;
    correctAnswer?: string;
  }[];
  
  // Scores
  totalMarks: number;
  marksObtained: number;
  percentage?: number;
  grade?: string;
  
  // Status
  status: 'pending' | 'graded';
  feedback?: string;
  
  // Late submission
  isLate?: boolean;
  
  // Attachments
  attachments?: string[];
  
  // Grading
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
  
  // Submission metadata
  submittedAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    submissionType: {
      type: String,
      enum: ['Test', 'Assignment'],
      required: true,
    },
    answers: [
      {
        questionId: String,
        questionText: String,
        studentAnswer: String,
        isCorrect: Boolean,
        marksObtained: Number,
        maxMarks: Number,
        correctAnswer: String,
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    marksObtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
    },
    grade: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'graded'],
      default: 'pending',
    },
    feedback: {
      type: String,
      maxlength: 2000,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    attachments: [String],
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    gradedAt: Date,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
SubmissionSchema.index({ student: 1, test: 1 });
SubmissionSchema.index({ student: 1, assignment: 1 });
SubmissionSchema.index({ school: 1, status: 1 });

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
