import { Router } from 'express';
import multer from 'multer';
import { analyzeCV, generateRoadmap, mockReview } from '../services/openai.js';
import type { AnalysisRequest, RoadmapRequest, MockReviewRequest } from '../types/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/analyze', async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body as AnalysisRequest;

    if (!cvText || !jobDescription) {
      res.status(400).json({ error: 'cvText and jobDescription are required' });
      return;
    }

    const result = await analyzeCV(cvText, jobDescription);
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze CV' });
  }
});

router.post('/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    let text = '';

    if (req.file.mimetype === 'text/plain' || req.file.originalname.endsWith('.txt')) {
      text = req.file.buffer.toString('utf-8');
    } else if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
      const mod = await import('pdf-parse') as any;
      const parser = new mod.PDFParse(new Uint8Array(req.file.buffer));
      const result = await parser.getText() as any;
      text = typeof result === 'string' ? result : (result.text ?? '');
    } else {
      res.status(400).json({ error: 'Unsupported file format. Please upload a .txt or .pdf file.' });
      return;
    }

    if (!text.trim()) {
      res.status(400).json({ error: 'Could not extract text from the file.' });
      return;
    }

    res.json({ text: text.slice(0, 10000) });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

router.post('/roadmap', async (req, res) => {
  try {
    const { missingSkills, jobTitle } = req.body as RoadmapRequest;

    if (!missingSkills || !missingSkills.length || !jobTitle) {
      res.status(400).json({ error: 'missingSkills and jobTitle are required' });
      return;
    }

    const result = await generateRoadmap(missingSkills, jobTitle);
    res.json(result);
  } catch (error) {
    console.error('Roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

router.post('/mock-review', async (req, res) => {
  try {
    const { jobDescription, questions, answers } = req.body as MockReviewRequest;

    if (!jobDescription || !questions || !answers) {
      res.status(400).json({ error: 'jobDescription, questions, and answers are required' });
      return;
    }

    const result = await mockReview(jobDescription, questions, answers);
    res.json(result);
  } catch (error) {
    console.error('Mock review error:', error);
    res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

export default router;
