import { useState } from 'react';
import Header from './components/Header';
import UploadCV from './components/UploadCV';
import JobDescription from './components/JobDescription';
import AnalysisResult from './components/AnalysisResult';
import LearningRoadmap from './components/LearningRoadmap';
import MockInterview from './components/MockInterview';
import FinalReview from './components/FinalReview';
import { analyzeCV, generateRoadmap, submitMockReview } from './services/api';
import type { Step, AnalysisResponse, RoadmapResponse, MockReviewResponse } from './types';

const SAMPLE_CV = `John Doe
Frontend Developer
john.doe@email.com | (555) 123-4567

SUMMARY
Experienced Frontend Developer with 4+ years building React applications. Proficient in TypeScript, state management, and modern CSS.

SKILLS
React, TypeScript, JavaScript (ES6+), Redux, Node.js, Express, PostgreSQL, Git, Docker, AWS (basic), TailwindCSS, Jest, Cypress

WORK EXPERIENCE
Senior Frontend Developer — TechCorp (2021–Present)
- Led migration of legacy Angular app to React, improving performance by 40%
- Built reusable component library used by 3 product teams
- Implemented CI/CD pipeline reducing deployment time from 2hrs to 15min
- Mentored 2 junior developers through pair programming and code reviews

Frontend Developer — StartupXYZ (2019–2021)
- Developed responsive React web app serving 50k+ daily users
- Integrated RESTful APIs and implemented real-time updates with WebSockets
- Reduced bundle size by 35% through code splitting and lazy loading

PROJECTS
E-Commerce Dashboard — React, TypeScript, Redux, Chart.js
- Real-time analytics dashboard with 10+ data visualization widgets
- Implemented role-based access control and export functionality

Task Manager API — Node.js, Express, PostgreSQL
- RESTful API with JWT authentication and rate limiting
- 95% test coverage with Jest and Supertest

EDUCATION
B.S. Computer Science — State University (2015–2019)`;

const SAMPLE_JOB = `Senior Frontend Engineer

Company: TechGrowth Inc.

We are looking for a Senior Frontend Engineer to join our growing team.

Requirements:
- 5+ years of frontend development experience
- Expert-level React knowledge with hooks and state management
- Strong TypeScript skills
- Experience with Node.js and RESTful APIs
- Understanding of performance optimization
- Experience with testing frameworks (Jest, React Testing Library)
- Familiarity with CI/CD pipelines
- Excellent communication and collaboration skills

Nice to have:
- Experience with Next.js or Remix
- GraphQL experience
- Docker and cloud deployment experience

We offer:
- Competitive salary: $130,000–$160,000
- Remote-friendly culture
- Health, dental, and vision insurance
- 401(k) matching
- Annual learning stipend`;

const SAMPLE_COMPANY = 'TechGrowth Inc.';

export default function App() {
  const [step, setStep] = useState<Step>('upload-cv');
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [review, setReview] = useState<MockReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeCV(cvText, jobDescription, companyName || undefined);
      setAnalysis(result);
      setStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleJobData = () => {
    setJobDescription(SAMPLE_JOB);
    setCompanyName(SAMPLE_COMPANY);
  };

  const handleRoadmap = async () => {
    if (!analysis || analysis.missingSkills.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const jobTitle = jobDescription.split('\n')[0].slice(0, 100) || 'the position';
      const result = await generateRoadmap(analysis.missingSkills, jobTitle);
      setRoadmap(result);
      setStep('roadmap');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewComplete = async (questions: string[], answers: string[]) => {
    setLoading(true);
    setError('');
    try {
      const result = await submitMockReview(jobDescription, questions, answers);
      setReview(result);
      setStep('final-review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate interview');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep('upload-cv');
    setCvText('');
    setJobDescription('');
    setCompanyName('');
    setAnalysis(null);
    setRoadmap(null);
    setReview(null);
  };

  const renderStep = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">
            {step === 'analysis' ? 'Analyzing your CV against the job posting...' :
             step === 'roadmap' ? 'Generating your learning roadmap...' :
             step === 'final-review' ? 'Evaluating your interview answers...' :
             'Processing...'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 mb-2">{error}</p>
          <button onClick={() => setError('')}
            className="text-red-600 underline text-sm hover:text-red-800">
            Dismiss
          </button>
        </div>
      );
    }

    switch (step) {
      case 'upload-cv':
        return <UploadCV cvText={cvText} onCvText={setCvText} onNext={() => setStep('job-description')} />;
      case 'job-description':
        return (
          <JobDescription
            value={jobDescription}
            onChange={setJobDescription}
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            onBack={() => setStep('upload-cv')}
            onNext={handleAnalyze}
            onUseSampleData={loadSampleJobData}
          />
        );
      case 'analysis':
        if (!analysis) return null;
        return (
          <AnalysisResult
            analysis={analysis}
            onBack={() => setStep('job-description')}
            onRoadmap={handleRoadmap}
            onInterview={() => setStep('interview')}
          />
        );
      case 'roadmap':
        if (!roadmap) return null;
        return (
          <LearningRoadmap
            roadmap={roadmap}
            onBack={() => setStep('analysis')}
            onInterview={() => setStep('interview')}
          />
        );
      case 'interview':
        return (
          <MockInterview
            jobDescription={jobDescription}
            cvText={cvText}
            missingSkills={analysis?.missingSkills ?? []}
            evidenceGaps={analysis?.evidenceGaps}
            onBack={() => setStep(roadmap ? 'roadmap' : 'analysis')}
            onComplete={handleInterviewComplete}
          />
        );
      case 'final-review':
        if (!review) return null;
        return <FinalReview review={review} onRestart={handleRestart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={step} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  );
}
