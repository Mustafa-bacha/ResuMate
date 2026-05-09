import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill {
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  endorsements: number;
}

export interface IExperience {
  jobTitle: string;
  company: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  description?: string;
  responsibilities: string[];
}

export interface IEducation {
  institution: string;
  degree: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
}

export interface ICertification {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl?: string;
  fileType: 'pdf' | 'docx' | 'txt';
  rawText?: string;
  isPrimary: boolean;
  extractedData: {
    summary?: string;
    experience: IExperience[];
    education: IEducation[];
    skills: ISkill[];
    certifications: ICertification[];
  };
  parsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    fileType: { type: String, enum: ['pdf', 'docx', 'txt'], default: 'pdf' },
    rawText: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    extractedData: {
      summary: { type: String, default: '' },
      experience: [
        {
          jobTitle: String,
          company: String,
          startDate: String,
          endDate: String,
          duration: String,
          description: String,
          responsibilities: [String],
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          graduationDate: String,
          gpa: String,
        },
      ],
      skills: [
        {
          name: { type: String, required: true },
          category: { type: String, default: 'Technical' },
          proficiency: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Intermediate',
          },
          yearsOfExperience: { type: Number, default: 0 },
          endorsements: { type: Number, default: 0 },
        },
      ],
      certifications: [
        {
          name: String,
          issuingOrganization: String,
          issueDate: String,
          expiryDate: String,
        },
      ],
    },
    parsedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
