import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPerson extends Document {
  user: Types.ObjectId;
  name: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPerson>('Person', PersonSchema);
