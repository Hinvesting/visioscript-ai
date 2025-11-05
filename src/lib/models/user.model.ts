import mongoose, { Document, Model } from 'mongoose';

export type SubscriptionStatus = 'free' | 'pro' | 'creator';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  stripeCustomerId?: string | null;
  subscriptionStatus: SubscriptionStatus;
  currentUsage: {
    imagesGenerated: number;
  };
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    stripeCustomerId: { type: String, default: null },
    subscriptionStatus: {
      type: String,
      enum: ['free', 'pro', 'creator'],
      default: 'free',
      required: true,
    },
    currentUsage: {
      imagesGenerated: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
