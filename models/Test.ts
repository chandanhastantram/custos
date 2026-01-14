import mongoose, { Schema, Document, Model } from 'mongoose';
import { TestType } from '@/types/enums';

export interface ITest extends Document {
  testType: TestType;
  date: Date;
  class: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  
  // Questions in this test
  questions: mongoose.Types.ObjectId[];
  
  // Generation metadata for adaptive tests
  generationMetadata?: {
    weakTopics: string[]; // 60% focus
    strongTopics: string[]; // 40% focus
    basedOnSubmissions: mongoose.Types.ObjectId[]; // Previous test submissions analyzed
  };
  
  // For daily tests
  relatedLessonDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    testType: {
      type: String,
      enum: Object.values(TestType),
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    generationMetadata: {
      weakTopics: [String],
      strongTopics: [String],
      basedOnSubmissions: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Submission',
        },
      ],
    },
    relatedLessonDate: Date,
  },
  {
    timestamps: true,
  }
);

const Test: Model<ITest> =
  mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;
