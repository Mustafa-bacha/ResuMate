import mongoose, { Document, Schema } from 'mongoose';

export interface IJobMatch extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  jobSource: 'manual' | 'api';
  analysis: {
    matchScore: number;
    matchedSkills: Array<{
      skill: string;
      level: 'match' | 'partial' | 'missing';
      importance: 'high' | 'medium' | 'low';
    }>;
    missingSkills: Array<{
      skill: string;
      category: string;
      priority: 'high' | 'medium' | 'low';
      estimatedWeeks?: number;
    }>;
    keyRecommendations: string[];
    resumeOptimizations: string[];
    learningPath: Array<{
      skill: string;
      estimatedWeeks: number;
      resources: string[];
    }>;
    summary: string;
  };
  savedAt?: Date;
  createdAt: Date;
}

const JobMatchSchema = new Schema<IJobMatch>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobSource: { type: String, enum: ['manual', 'api'], default: 'manual' },
    analysis: {
      matchScore: { type: Number, min: 0, max: 100, default: 0 },
      matchedSkills: [
        {
          skill: String,
          level: { type: String, enum: ['match', 'partial', 'missing'], default: 'match' },
          importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        },
      ],
      missingSkills: [
        {
          skill: String,
          category: String,
          priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
          estimatedWeeks: Number,
        },
      ],
      keyRecommendations: [String],
      resumeOptimizations: [String],
      learningPath: [
        {
          skill: String,
          estimatedWeeks: Number,
          resources: [String],
        },
      ],
      summary: { type: String, default: '' },
    },
    savedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.JobMatch || mongoose.model<IJobMatch>('JobMatch', JobMatchSchema);
