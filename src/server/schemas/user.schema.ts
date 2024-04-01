import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  username: string;
  password: string;
  email: string;
  role: string;
  status: boolean;
}

export const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'pilot' },
  status: { type: Boolean, required: true, default: false },
})