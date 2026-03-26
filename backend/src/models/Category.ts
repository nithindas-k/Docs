import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
  user: Types.ObjectId;
  name: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
