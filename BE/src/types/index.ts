export interface AnalysisRequest {
  cvText: string;
  jobDescription: string;
  companyName?: string;
}

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
  evidenceSource: 'skills' | 'project' | 'experience' | 'none';
}

export interface CompanyContext {
  onlinePresence: string;
  publicSignals: string[];
  engineeringVisibility: string;
  transparency: string;
  concerns: string[];
  disclaimer: string;
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
  companyContext: CompanyContext | null;
  interviewRisk: 'low' | 'medium' | 'high';
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
  cvText?: string;
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
  hiringRecommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No' | 'Strong No';
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
