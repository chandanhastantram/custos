import mongoose, { Schema, Document, Model } from 'mongoose';
import { NotificationType } from '@/types/enums';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId; // Parent or Student
  school: mongoose.Types.ObjectId;
  
  type: NotificationType;
  title: string;
  message: string;
  
  // Optional links
  relatedTest?: mongoose.Types.ObjectId;
  relatedEvent?: mongoose.Types.ObjectId;
  
  isRead: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedTest: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
    },
    relatedEvent: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
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

// Index for efficient notification retrieval
NotificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
