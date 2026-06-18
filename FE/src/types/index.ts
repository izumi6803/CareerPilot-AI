export type Step = 'upload-cv' | 'job-description' | 'analysis' | 'roadmap' | 'interview' | 'final-review';

export type DecisionAction = 'APPLY_NOW' | 'IMPROVE_FIRST' | 'AVOID_FOR_NOW';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface DecisionEngine {
  action: DecisionAction;
  confidence: ConfidenceLevel;
  reason: string;
}

export interface EvidenceGap {
  skill: string;
  strength: 'Strong' | 'Medium' | 'Weak' | 'Missing';
  reason: string;
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
  decision: DecisionEngine;
  evidenceGaps: EvidenceGap[];
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

export interface InterviewRiskPrediction {
  category: 'technical' | 'communication' | 'confidence';
  risk: 'high' | 'medium' | 'low';
  reason: string;
}

export interface MockReviewResponse {
  perQuestion: PerQuestionReview[];
  overall: OverallReview;
  interviewRiskPrediction: InterviewRiskPrediction[];
}
