import { Schema, Document } from 'mongoose';

export interface IOnlineUav extends Document {
  uavname: string;
  uavId: string;
  connected: boolean;
  socketId: string;
}

export const OnlineUavSchema = new Schema<IOnlineUav>({
  uavname: { type: String, required: true },
  uavId: { type: String, required: true },
  connected: { type: Boolean, required: true },
  socketId: { type: String, required: false },
})