// server/src/models/User.ts
import { model, Schema, Document } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  googleId: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
}, { timestamps: true });

export default model<IUser>('User', userSchema);