import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  student: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  
  // Answers array
  answers: {
    question: mongoose.Types.ObjectId;
    studentAnswer?: string; // For MCQs
    isCorrect?: boolean; // Auto-graded for MCQs, manually set for theory
  }[];
  
  // Scores
  totalQuestions: number;
  correctAnswers: number;
  score: number; // Percentage
  
  // Submission metadata
  submittedAt: Date;
  isGraded: boolean; // True for MCQs (auto), false until teacher grades theory
  
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
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    answers: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        studentAnswer: String,
        isCorrect: Boolean,
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isGraded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate submissions
SubmissionSchema.index({ student: 1, test: 1 }, { unique: true });

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
