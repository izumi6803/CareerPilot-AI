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
  const prompt = `You are an expert career coach and HR professional. Analyze this CV and job posting thoroughly.

CV:
${cvText.slice(0, 8000)}

Job Posting:
${jobDescription.slice(0, 4000)}

Instructions:
- Analyze the candidate's CV against the full job posting
- Calculate a fit score (0-100) based on skill match, experience level, and requirements
- Explain clearly why the candidate is a good fit or not a good fit
- Identify missing skills the candidate would need to learn
- Detect risk signals in the job posting itself (e.g. salary seems unrealistic for the role, vague requirements, suspicious urgency, weak company description, too many requirements for the level). NEVER call any company a scam. Only classify risk as low / medium / high.
- Suggest specific CV improvements the candidate should make before applying
- Generate 10 must-know interview questions the candidate should prepare for this specific role
- Use the Decision Engine to recommend whether the candidate should APPLY_NOW, IMPROVE_FIRST, or AVOID_FOR_NOW based on fit score, risk, and evidence gaps. Provide a confidence level (high/medium/low) and a clear reason.
- Use the Evidence Gap Engine to evaluate EACH skill in the job posting. For each skill, classify the candidate's proof as Strong (CV clearly demonstrates this skill), Medium (some evidence but not fully proven), Weak (little evidence), or Missing (no evidence at all). Include reasoning.

Return a JSON object with:
{
  "fitScore": <number 0-100>,
  "fitSummary": "detailed explanation of why the candidate fits or does not fit, including specific reasoning",
  "strengths": ["specific matching skill or experience", ...],
  "weaknesses": ["specific area where candidate falls short", ...],
  "missingSkills": ["important skill completely missing from CV", ...],
  "riskLevel": "low" | "medium" | "high",
  "riskSignals": ["specific concern about the job posting (e.g. salary range seems inflated for this role)", ...],
  "cvImprovements": ["specific, actionable change to make to the CV before applying", ...],
  "mustKnowQuestions": ["essential interview question for this specific role", ...],
  "decision": {
    "action": "APPLY_NOW" | "IMPROVE_FIRST" | "AVOID_FOR_NOW",
    "confidence": "high" | "medium" | "low",
    "reason": "explanation for the decision"
  },
  "evidenceGaps": [
    {"skill": "skill name", "strength": "Strong" | "Medium" | "Weak" | "Missing", "reason": "why this skill is or isn't proven by the CV"}
  ]
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

export async function generateQuestions(
  jobDescription: string,
  cvText: string,
  missingSkills: string[],
  count: number,
  evidenceGaps?: { skill: string; strength: string; reason: string }[]
): Promise<string[]> {
  const missing = missingSkills.length ? `\nCandidate's missing skills to assess: ${missingSkills.join(', ')}` : '';
  const gaps = evidenceGaps?.length ? `\nEvidence gaps (skills where CV lacks proof): ${evidenceGaps.map(g => `${g.skill} (${g.strength})`).join(', ')}` : '';
  const prompt = `You are a technical interviewer. Generate exactly ${count} interview questions based on the following.

Candidate's CV/Experience:
${cvText.slice(0, 3000)}
${missing}
${gaps}

Job Posting Requirements:
${jobDescription.slice(0, 3000)}

RULES:
1. Prioritize questions based on the candidate's tech stack (from CV)
2. Prioritize job-required technical skills (from job posting)
3. Include JavaScript fundamentals questions (closures, promises, event loop)
4. Include React fundamentals questions (hooks, lifecycle, rendering)
5. Include TypeScript questions (types, generics, utilities)
6. Include API handling questions (REST, error handling, async)
7. Include state management questions
8. Include performance optimization questions
9. Include async/event loop questions
10. Include project architecture questions
11. Include problem-solving questions
12. Include project deep-dive questions
13. AVOID generic business-domain questions unless explicitly in the job posting
14. Focus on evidence gap areas — ask questions that test skills where the CV shows Weak or Missing proof

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

  const prompt = `You are a senior technical hiring manager. Evaluate the candidate's interview answers.

Job Posting Requirements:
${jobDescription.slice(0, 3000)}

Interview Q&A:
${qaPairs}

For EACH question, evaluate:
- score (1-10)
- strengths of the answer
- weaknesses of the answer
- ideal/ model answer
- specific improvement suggestion

Then for overall evaluation, provide:
- overall technical score (0-100)
- communication score (0-100) — clarity, structure, articulation
- confidence score (0-100) — certainty, decisiveness, leadership tone
- overall strengths
- overall weaknesses
- hiring recommendation (Strong Yes / Yes / Maybe / No / Strong No)
- senior engineer simulated feedback — a detailed paragraph as if written by a senior engineer reviewing this candidate, covering technical depth, communication style, and growth potential

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
    "technicalScore": <number 0-100>,
    "communicationScore": <number 0-100>,
    "confidenceScore": <number 0-100>,
    "strengths": ["overall strength across all answers", ...],
    "weaknesses": ["overall weakness across all answers", ...],
    "hiringRecommendation": "Strong Yes" | "Yes" | "Maybe" | "No" | "Strong No",
    "seniorFeedback": "detailed paragraph as if from a senior engineer reviewing this candidate"
  },
  "interviewRiskPrediction": [
    {
      "category": "technical" | "communication" | "confidence",
      "risk": "high" | "medium" | "low",
      "reason": "specific fail point and why it's likely to cause issues in a real interview"
    }
  ]
}`;

  return JSON.parse(cleanJSON(await generateJSON(prompt)));
}
