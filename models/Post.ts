import mongoose, { Schema, Document, Model } from 'mongoose';
import { PostType } from '@/types/enums';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId; // Admin or Sub-Admin
  school: mongoose.Types.ObjectId;
  
  type: PostType;
  title?: string;
  content?: string; // For blog posts
  mediaUrl?: string; // For photos or uploaded files
  
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: {
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
      enum: Object.values(PostType),
      required: true,
    },
    title: String,
    content: String,
    mediaUrl: String,
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
