import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: { prompt: number; completion: number };
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  jobMatchId?: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  context: {
    type: 'general' | 'resume-focused' | 'job-focused';
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    jobMatchId: { type: Schema.Types.ObjectId, ref: 'JobMatch' },
    title: { type: String, default: 'New Conversation' },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        tokens: {
          prompt: { type: Number, default: 0 },
          completion: { type: Number, default: 0 },
        },
      },
    ],
    context: {
      type: {
        type: String,
        enum: ['general', 'resume-focused', 'job-focused'],
        default: 'general',
      },
    },
  },
  {
    timestamps: true,
    // Auto-expire after 30 days (optional, remove if you want permanent storage)
    // expireAfterSeconds: 2592000,
  }
);

export default mongoose.models.ChatSession ||
  mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
