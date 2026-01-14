import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  from: mongoose.Types.ObjectId; // Parent
  to: mongoose.Types.ObjectId; // Teacher
  school: mongoose.Types.ObjectId;
  
  subject?: string;
  message: string;
  
  // Conversation threading
  conversationId: string;
  
  isRead: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
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
    subject: String,
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    conversationId: {
      type: String,
      required: true,
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

// Index for efficient conversation retrieval
MessageSchema.index({ conversationId: 1, createdAt: -1 });

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
