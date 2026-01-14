import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILessonPlan extends Document {
  teacher: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  
  // Daily breakdown structure
  dailyPlan: {
    date: Date;
    topic: string;
    subTopics: {
      name: string;
      duration: number; // in minutes
      sections: {
        type: string; // "Warm-up", "Introduction", "Content", "Activity", "Visual Aids"
        content: string;
      }[];
    }[];
  }[];
  
  isEdited: boolean; // Track if teacher edited AI-generated plan
  createdAt: Date;
  updatedAt: Date;
}

const LessonPlanSchema = new Schema<ILessonPlan>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    dailyPlan: [
      {
        date: { type: Date, required: true },
        topic: { type: String, required: true },
        subTopics: [
          {
            name: { type: String, required: true },
            duration: { type: Number, required: true },
            sections: [
              {
                type: { type: String, required: true },
                content: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LessonPlan: Model<ILessonPlan> =
  mongoose.models.LessonPlan ||
  mongoose.model<ILessonPlan>('LessonPlan', LessonPlanSchema);

export default LessonPlan;
