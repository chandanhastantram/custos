import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  logo?: string;
  primaryColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#3B82F6', // Default blue color
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code'],
    },
  },
  {
    timestamps: true,
  }
);

const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
