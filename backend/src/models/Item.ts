import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDynamicField {
  key: string;
  value: string;
  isEncrypted: boolean;
}

export interface IItem extends Document {
  user: Types.ObjectId;
  category: Types.ObjectId;
  person?: Types.ObjectId; 
  title: string;
  photoUrl?: string;
  fields: IDynamicField[];
  createdAt: Date;
  updatedAt: Date;
}

const DynamicFieldSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  isEncrypted: { type: Boolean, default: false },
}, { _id: false });

const ItemSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    person: { type: Schema.Types.ObjectId, ref: 'Person' }, 
    title: { type: String, required: true },
    photoUrl: { type: String },
    fields: [DynamicFieldSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);
