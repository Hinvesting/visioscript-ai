import mongoose, { Document, Model } from 'mongoose';

export interface IScene {
  id: string;
  description?: string;
  dialogue?: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  contentType: string;
  scenes: IScene[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SceneSchema = new mongoose.Schema<IScene>(
  {
    id: { type: String, required: true },
    description: { type: String },
    dialogue: { type: String },
    imagePrompt: { type: String },
    imageUrl: { type: String },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    contentType: { type: String, required: true },
    scenes: { type: [SceneSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const ProjectModel: Model<IProject> = (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
