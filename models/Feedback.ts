import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
  from: mongoose.Types.ObjectId; // Teacher or Admin
  to: mongoose.Types.ObjectId; // Student or Teacher
  school: mongoose.Types.ObjectId;
  
  message: string;
  relatedTest?: mongoose.Types.ObjectId; // Optional: link to specific test
  
  isRead: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
    },
    relatedTest: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
