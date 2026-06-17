import { useState, useRef, useEffect } from 'react';
import { startInterview, answerInterview } from '../services/api';

interface MockInterviewProps {
  jobDescription: string;
  onBack: () => void;
  onComplete: (questions: string[], answers: string[]) => void;
}

export default function MockInterview({ jobDescription, onBack, onComplete }: MockInterviewProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const totalQ = questions.length;
  const isLast = currentQ >= totalQ - 1;
  const allDone = currentQ >= totalQ && totalQ > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQ, loading]);

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await startInterview(jobDescription);
      setSessionId(result.sessionId);
      setQuestions([result.question]);
      setCurrentQ(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!answer.trim() || !sessionId) return;
    const userAnswer = answer.trim();
    setAnswer('');
    setLoading(true);
    setError('');

    try {
      const result = await answerInterview(sessionId, userAnswer);
      setAnswers((prev) => [...prev, userAnswer]);
      setCurrentQ((prev) => prev + 1);

      if (result.nextQuestion) {
        setQuestions((prev) => [...prev, result.nextQuestion!]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save answer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAll = () => {
    onComplete(questions, answers);
  };

  if (!sessionId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Mock Interview</h2>
        <p className="text-gray-600 mb-6">You will answer 10 technical questions tailored to the job. Your answers will be reviewed at the end.</p>

        <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-left text-sm text-gray-700">
          <p className="font-medium text-indigo-800 mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Answer as you would in a real interview</li>
            <li>Use the STAR method for behavioral questions</li>
            <li>Be specific about your experience</li>
          </ul>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-center gap-3">
          <button onClick={onBack} className="px-5 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button onClick={handleStart} disabled={loading}
            className="px-5 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 transition-colors">
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">All Questions Answered</h2>
        <p className="text-gray-600 mb-2">You have completed all {totalQ} questions.</p>
        <p className="text-sm text-gray-500 mb-6">Submit your answers for a detailed AI evaluation.</p>

        <div className="flex justify-center gap-3">
          <button onClick={onBack}
            className="px-5 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button onClick={handleSubmitAll}
            className="px-5 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Submit for Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Mock Interview</h2>
        <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQ || '?'}</span>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Question {currentQ + 1}:</p>
        <p className="text-gray-900">{questions[currentQ]}</p>
      </div>

      <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        {answers.map((a, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-xs font-medium text-gray-400 mb-1">Q{i + 1}</p>
            <div className="bg-indigo-50 rounded-lg px-3 py-2 text-sm text-gray-800">
              <p className="whitespace-pre-wrap">{a}</p>
            </div>
          </div>
        ))}
        {answers.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-16">Your answers will appear here</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          rows={2}
          className="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <button
          onClick={handleNext}
          disabled={!answer.trim() || loading}
          className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors self-end"
        >
          {loading ? 'Sending...' : isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
