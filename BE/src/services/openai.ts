import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';
import type {
  AnalysisResponse, RoadmapResponse, MockReviewResponse,
} from '../types/index.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const JSON_MODEL = 'llama-3.3-70b-versatile';
const TEXT_MODEL = 'llama-3.1-8b-instant';

function cleanJSON(text: string): string {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

async function generateJSON(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: JSON_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return completion.choices[0]?.message?.content ?? '{}';
}

async function generateText(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: TEXT_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });
  return completion.choices[0]?.message?.content ?? '';
}

export async function analyzeCV(cvText: string, jobDescription: string): Promise<AnalysisResponse> {
  const prompt = `You are an expert career coach and HR professional. Analyze this CV against the job description.

CV:
${cvText.slice(0, 8000)}

Job Description:
${jobDescription.slice(0, 4000)}

Return a JSON object with:
{
  "fitScore": <number 0-100>,
  "fitSummary": "1-2 sentence overall assessment",
  "strengths": ["skill or experience that matches well", ...],
  "weaknesses": ["area where candidate falls short", ...],
  "missingSkills": ["important skill completely missing", ...],
  "riskLevel": "low" | "medium" | "high",
  "riskSignals": ["red flags or concerns in the application", ...],
  "cvImprovements": ["specific suggestion to improve the CV", ...],
  "mustKnowQuestions": ["key question the candidate should prepare for", ...]
}`;

  return JSON.parse(cleanJSON(await generateJSON(prompt)));
}

export async function generateRoadmap(missingSkills: string[], jobTitle: string): Promise<RoadmapResponse> {
  const skills = missingSkills.join(', ');
  const prompt = `You are a career development expert. Create a 4-week learning roadmap for someone targeting a "${jobTitle}" role who needs to acquire these skills: ${skills}

Return a JSON object with:
{
  "weeks": [
    {
      "week": 1,
      "focus": "weekly theme",
      "topics": ["specific topic", ...],
      "resources": [{"title": "resource name", "url": "https://..."}, ...]
    },
    ...
  ]
}

Each week should have 3-5 topics and 2-3 resources. Make URLs realistic (use common platforms like MDN, freeCodeCamp, YouTube, official docs).`;

  return JSON.parse(cleanJSON(await generateJSON(prompt)));
}

export async function generateQuestions(jobDescription: string, count: number): Promise<string[]> {
  const prompt = `You are a technical interviewer for the role described below. Generate exactly ${count} interview questions following these RULES:

1. Prioritize technical questions based on the candidate's tech stack (extracted from the job description)
2. Prioritize job-required technical skills
3. Include JavaScript fundamentals questions
4. Include React fundamentals questions
5. Include problem-solving questions
6. Include project deep-dive questions
7. AVOID non-technical business-domain questions unless explicitly in the job description

Job Description:
${jobDescription.slice(0, 4000)}

Return ONLY a JSON array of strings: ["question 1", "question 2", ...]`;

  const text = await generateJSON(prompt);
  const parsed = JSON.parse(cleanJSON(text));
  return Array.isArray(parsed) ? parsed : (parsed.questions ?? []);
}

export async function mockReview(
  jobDescription: string,
  questions: string[],
  answers: string[]
): Promise<MockReviewResponse> {
  const qaPairs = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] ?? '(no answer)'}`).join('\n\n');

  const prompt = `You are a senior technical hiring manager. Evaluate the candidate's interview answers for the role below.

Job Description:
${jobDescription.slice(0, 3000)}

Interview Q&A:
${qaPairs}

Return a JSON object with:
{
  "perQuestion": [
    {
      "question": "the question",
      "answer": "the candidate's answer",
      "score": <number 1-10>,
      "strengths": ["what was good about this answer", ...],
      "weaknesses": ["what was lacking", ...],
      "idealAnswer": "a model answer for comparison",
      "suggestion": "how to improve this specific answer"
    }
  ],
  "overall": {
    "totalScore": <number 0-100>,
    "strengths": ["overall strength across all answers", ...],
    "weaknesses": ["overall weakness across all answers", ...],
    "hiringRecommendation": "Strong Yes" | "Yes" | "Maybe" | "No" | "Strong No",
    "seniorFeedback": "detailed paragraph as if from a senior engineer reviewing this candidate"
  }
}`;

  return JSON.parse(cleanJSON(await generateJSON(prompt)));
}
