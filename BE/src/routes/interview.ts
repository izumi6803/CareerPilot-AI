import { Router } from 'express';
import crypto from 'crypto';
import { generateQuestions } from '../services/openai.js';
import type { InterviewSession, InterviewStartResponse, InterviewAnswerResponse } from '../types/index.js';

const router = Router();

const sessions = new Map<string, InterviewSession & { _createdAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s._createdAt > 60 * 60 * 1000) sessions.delete(id);
  }
}, 30 * 60 * 1000);

router.post('/start', async (req, res) => {
  try {
    const { jobDescription } = req.body as { jobDescription: string };
    if (!jobDescription) {
      res.status(400).json({ error: 'jobDescription is required' });
      return;
    }

    const questions = await generateQuestions(jobDescription, 10);
    const sessionId = crypto.randomUUID();

    const session: InterviewSession & { _createdAt: number } = {
      jobDescription,
      questions,
      answers: [],
      questionCount: 0,
      _createdAt: Date.now(),
    };

    sessions.set(sessionId, session);

    const response: InterviewStartResponse = {
      sessionId,
      question: questions[0],
      totalQuestions: questions.length,
    };
    res.json(response);
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

router.post('/answer', async (req, res) => {
  try {
    const { sessionId, answer } = req.body as { sessionId: string; answer: string };

    if (!sessionId || !answer) {
      res.status(400).json({ error: 'sessionId and answer are required' });
      return;
    }

    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found or expired' });
      return;
    }

    session.answers.push(answer);
    session.questionCount++;

    const isComplete = session.questionCount >= session.questions.length;

    const response: InterviewAnswerResponse = {
      nextQuestion: isComplete ? null : session.questions[session.questionCount],
      isComplete,
    };

    if (isComplete) {
      sessions.delete(sessionId);
    }

    res.json(response);
  } catch (error) {
    console.error('Interview answer error:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

export default router;
