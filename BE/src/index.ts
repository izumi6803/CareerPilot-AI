import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.js';
import interviewRoutes from './routes/interview.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', analysisRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  const index = path.join(publicDir, 'index.html');
  res.sendFile(index);
});
app.listen(port, () => {
  console.log(`CareerPilot AI server running on http://localhost:${port}`);
});
