import type { AnalysisResponse, RoadmapResponse, InterviewStartResponse, InterviewAnswerResponse, MockReviewResponse } from '../types';

const BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function uploadCV(file: File): Promise<{ text: string }> {
  const form = new FormData();
  form.append('cv', file);
  return handleResponse(await fetch(`${BASE}/upload-cv`, { method: 'POST', body: form }));
}

export async function analyzeCV(cvText: string, jobDescription: string): Promise<AnalysisResponse> {
  return handleResponse(await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvText, jobDescription }),
  }));
}

export async function generateRoadmap(missingSkills: string[], jobTitle: string): Promise<RoadmapResponse> {
  return handleResponse(await fetch(`${BASE}/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ missingSkills, jobTitle }),
  }));
}

export async function startInterview(jobDescription: string, cvText: string, missingSkills: string[], evidenceGaps?: { skill: string; strength: string; reason: string }[]): Promise<InterviewStartResponse> {
  return handleResponse(await fetch(`${BASE}/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription, cvText, missingSkills, evidenceGaps }),
  }));
}

export async function answerInterview(sessionId: string, answer: string): Promise<InterviewAnswerResponse> {
  return handleResponse(await fetch(`${BASE}/interview/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, answer }),
  }));
}

export async function submitMockReview(jobDescription: string, questions: string[], answers: string[]): Promise<MockReviewResponse> {
  return handleResponse(await fetch(`${BASE}/mock-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription, questions, answers }),
  }));
}
