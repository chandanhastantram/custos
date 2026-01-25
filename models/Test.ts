import mongoose, { Schema, Document, Model } from 'mongoose';
import { TestType } from '@/types/enums';

// Embedded question interface
interface IEmbeddedQuestion {
  questionText: string;
  type: 'MCQ' | 'Theory';
  topic?: string;
  subTopic?: string;
  difficulty?: string;
  bloomsLevel?: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  isAIGenerated?: boolean;
}

export interface ITest extends Document {
  school: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  class: string;
  section?: string;
  teacher: mongoose.Types.ObjectId;
  testType: TestType;
  
  // Embedded questions
  questions: IEmbeddedQuestion[];
  
  // Scores
  totalMarks: number;
  duration: number;
  
  // Scheduling
  scheduledDate?: Date;
  
  // AI metadata
  isAIGenerated: boolean;
  aiMetadata?: {
    weakTopics: string[];
    strongTopics: string[];
    distribution: {
      weak: number;
      strong: number;
    };
  };
  
  // Status
  isPublished: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    title: {
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
    section: String,
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testType: {
      type: String,
      enum: Object.values(TestType),
      default: TestType.DAILY,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        type: { type: String, enum: ['MCQ', 'Theory'], default: 'MCQ' },
        topic: String,
        subTopic: String,
        difficulty: String,
        bloomsLevel: String,
        options: [String],
        correctAnswer: String,
        marks: { type: Number, default: 1 },
        isAIGenerated: { type: Boolean, default: false },
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 45,
    },
    scheduledDate: Date,
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    aiMetadata: {
      weakTopics: [String],
      strongTopics: [String],
      distribution: {
        weak: Number,
        strong: Number,
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
TestSchema.index({ school: 1, class: 1, scheduledDate: -1 });
TestSchema.index({ teacher: 1, createdAt: -1 });

const Test: Model<ITest> =
  mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;
