import { Router } from 'express';
import multer from 'multer';
import { analyzeCV, generateRoadmap, mockReview } from '../services/aiService.js';
import { extractCVWithGemini } from '../services/cvExtractor.js';
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

const IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

function isImage(mime: string, filename: string): boolean {
  return IMAGE_MIMES.includes(mime) || /\.(png|jpe?g|webp)$/i.test(filename);
}

router.post('/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { buffer, mimetype, originalname } = req.file;
    let text = '';
    let usedFallback = false;
    let extractionMethod = '';

    if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      text = buffer.toString('utf-8');
      extractionMethod = 'direct_text';
      console.log(`[CV Extractor] Direct text extraction: ${text.length} chars`);
    } else if (
      mimetype === 'application/pdf' ||
      originalname.endsWith('.pdf') ||
      isImage(mimetype, originalname)
    ) {
      try {
        console.log(`[CV Extractor] Sending to Gemini: ${originalname} (${mimetype})`);
        text = await extractCVWithGemini(buffer, mimetype);
        extractionMethod = 'gemini';
        console.log(`[CV Extractor] Gemini extraction succeeded: ${text.length} chars`);
      } catch (geminiError) {
        console.warn(`[CV Extractor] Gemini extraction failed:`, geminiError);

        if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
          console.log(`[CV Extractor] Falling back to pdf-parse`);
          try {
            const mod = await import('pdf-parse') as any;
            const parser = new mod.PDFParse(new Uint8Array(buffer));
            const result = await parser.getText() as any;
            text = typeof result === 'string' ? result : (result.text ?? '');
            usedFallback = true;
            extractionMethod = 'pdf-parse (fallback)';
            console.log(`[CV Extractor] pdf-parse fallback succeeded: ${text.length} chars`);

            if (text.trim().length < 30) {
              console.log(`[CV Extractor] pdf-parse returned too little text — likely a scanned/image-based PDF`);
              res.status(400).json({ error: 'This appears to be a scanned/image-based PDF. The system only supports text-based PDFs and .txt files. Please use a text-based PDF or paste your CV text directly.' });
              return;
            }
          } catch (pdfError) {
            console.error(`[CV Extractor] pdf-parse fallback also failed:`, pdfError);
            res.status(400).json({ error: 'This appears to be a scanned/image-based PDF. The system only supports text-based PDFs and .txt files. Please use a text-based PDF or paste your CV text directly.' });
            return;
          }
        } else {
          res.status(400).json({ error: `Unsupported file format: ${mimetype}. Please upload a .txt or .pdf file.` });
          return;
        }
      }
    } else {
      res.status(400).json({ error: 'Unsupported file format. Please upload a .txt or .pdf file.' });
      return;
    }

    if (!text.trim()) {
      res.status(400).json({ error: 'Could not extract text from the file.' });
      return;
    }

    console.log(`[CV Extractor] Result — method: ${extractionMethod}, chars: ${text.length}, fallback: ${usedFallback}`);
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
