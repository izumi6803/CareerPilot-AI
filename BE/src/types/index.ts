export interface AnalysisRequest {
  cvText: string;
  jobDescription: string;
}

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

export interface RoadmapRequest {
  missingSkills: string[];
  jobTitle: string;
}

export interface Resource {
  title: string;
  url: string;
}

export interface RoadmapWeek {
  week: number;
  focus: string;
  topics: string[];
  resources: Resource[];
}

export interface RoadmapResponse {
  weeks: RoadmapWeek[];
}

export interface InterviewSession {
  jobDescription: string;
  questions: string[];
  answers: string[];
  questionCount: number;
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

export interface MockReviewRequest {
  jobDescription: string;
  questions: string[];
  answers: string[];
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
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No' | 'Strong No';
  seniorFeedback: string;
}

export interface MockReviewResponse {
  perQuestion: PerQuestionReview[];
  overall: OverallReview;
}
