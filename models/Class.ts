import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClass extends Document {
  name: string; // e.g., "Class 10"
  sections: string[]; // e.g., ["A", "B", "C"]
  school: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    sections: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique class names per school
ClassSchema.index({ name: 1, school: 1 }, { unique: true });

const Class: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;
