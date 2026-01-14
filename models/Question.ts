import mongoose, { Schema, Document, Model } from 'mongoose';
import { QuestionType, DifficultyLevel, TestType } from '@/types/enums';

// Re-export for backward compatibility
export { QuestionType, DifficultyLevel, TestType };

export interface IQuestion extends Document {
  questionNumber: string; // Unique ID for the question
  questionText: string; // Frontend display
  
  // Backend metadata (the pattern logic)
  topic: string; // Main topic
  subTopic: string; // Specific sub-topic
  difficulty: DifficultyLevel;
  type: QuestionType; // Analytical tag
  
  // For MCQs
  options?: string[];
  correctAnswer?: string;
  
  // For theory questions
  isTheory: boolean;
  
  // References
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  testType: TestType;
  
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    subTopic: {
      type: String,
      required: [true, 'Sub-topic is required'],
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },
    options: [String],
    correctAnswer: String,
    isTheory: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    testType: {
      type: String,
      enum: Object.values(TestType),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
