export type Step = 'upload-cv' | 'job-description' | 'analysis' | 'roadmap' | 'interview' | 'final-review';

export interface AnalysisResponse {
  fitScore: number;
  fitSummary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  riskLevel: 'low' | 'medium' | 'high';
  riskSignals: string[];
  cvImprovements: string[];
  mustKnowQuestions: string[];
}

export interface RoadmapWeek {
  week: number;
  focus: string;
  topics: string[];
  resources: { title: string; url: string }[];
}

export interface RoadmapResponse {
  weeks: RoadmapWeek[];
}

export interface InterviewStartResponse {
  sessionId: string;
  question: string;
  totalQuestions: number;
}

export interface InterviewAnswerResponse {
  nextQuestion: string | null;
  isComplete: boolean;
}

export interface PerQuestionReview {
  question: string;
  answer: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
  suggestion: string;
}

export interface OverallReview {
  totalScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: string;
  seniorFeedback: string;
}

export interface MockReviewResponse {
  perQuestion: PerQuestionReview[];
  overall: OverallReview;
}
