import { Schema, Document } from 'mongoose';

export interface IUav extends Document {
  uavname: string;
  password: string;
  type: string;
  phonenumber: string;
}

export const UavSchema = new Schema<IUav>({
  uavname: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  phonenumber: { type: String, required: true },
})
