import mongoose, { Document, Schema, Types } from 'mongoose';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface IConnection extends Document {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

ConnectionSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export default mongoose.model<IConnection>('Connection', ConnectionSchema);
