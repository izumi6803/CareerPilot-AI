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

export default function App() {
  const [step, setStep] = useState<Step>('upload-cv');
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [review, setReview] = useState<MockReviewResponse | null>(null);
  const [interviewQ, setInterviewQ] = useState<string[]>([]);
  const [interviewA, setInterviewA] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeCV(cvText, jobDescription);
      setAnalysis(result);
      setStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
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
    setInterviewQ(questions);
    setInterviewA(answers);
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
    setAnalysis(null);
    setRoadmap(null);
    setReview(null);
    setInterviewQ([]);
    setInterviewA([]);
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
            onBack={() => setStep('upload-cv')}
            onNext={handleAnalyze}
          />
        );
      case 'analysis':
        if (!analysis) return null;
        return (
          <AnalysisResult
            analysis={analysis}
            jobDescription={jobDescription}
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
