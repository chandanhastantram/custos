import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/types/enums';

// Re-export UserRole for backward compatibility in server-side code
export { UserRole };

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  school: mongoose.Types.ObjectId;
  profilePicture?: string;
  
  // Student-specific fields
  class?: mongoose.Types.ObjectId;
  section?: string;
  
  // Parent-specific fields
  children?: mongoose.Types.ObjectId[]; // References to Student users
  
  // Teacher-specific fields
  subjects?: mongoose.Types.ObjectId[]; // Subjects they teach
  
  createdAt: Date;
  updatedAt: Date;
  
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'Role is required'],
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    // Student-specific
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    section: {
      type: String,
    },
    // Parent-specific
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Teacher-specific
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
