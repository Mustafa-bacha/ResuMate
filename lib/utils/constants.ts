export const APP_NAME = 'ResuMate';
export const APP_TAGLINE = 'Resume Elevated';
export const APP_DESCRIPTION = 'AI-powered career & skill intelligence platform';

export const SKILL_CATEGORIES = [
  'Technical',
  'Soft Skills',
  'Languages',
  'Frameworks',
  'Tools',
  'Databases',
  'Cloud',
  'DevOps',
  'Design',
  'Management',
  'Other',
];

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export const SUBSCRIPTION_LIMITS = {
  free: {
    resumes: 1,
    jobMatches: 3,
    chatMessages: 100,
  },
  pro: {
    resumes: 10,
    jobMatches: 50,
    chatMessages: 1000,
  },
  enterprise: {
    resumes: -1, // unlimited
    jobMatches: -1,
    chatMessages: -1,
  },
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

export const MATCH_SCORE_LABELS = {
  excellent: { min: 80, label: 'Excellent Match', color: 'text-emerald-600' },
  good: { min: 60, label: 'Good Match', color: 'text-blue-600' },
  fair: { min: 40, label: 'Fair Match', color: 'text-amber-600' },
  poor: { min: 0, label: 'Needs Work', color: 'text-red-600' },
};

export function getMatchLabel(score: number) {
  if (score >= 80) return MATCH_SCORE_LABELS.excellent;
  if (score >= 60) return MATCH_SCORE_LABELS.good;
  if (score >= 40) return MATCH_SCORE_LABELS.fair;
  return MATCH_SCORE_LABELS.poor;
}
