import type { MockReviewResponse } from '../types';

interface FinalReviewProps {
  review: MockReviewResponse;
  onRestart: () => void;
}

function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

function scoreBg(score: number): string {
  if (score >= 8) return 'bg-green-100';
  if (score >= 6) return 'bg-yellow-100';
  return 'bg-red-100';
}

function recommendationColor(rec: string): string {
  if (rec.startsWith('Strong Yes') || rec.startsWith('Yes')) return 'text-green-700 bg-green-50 border-green-200';
  if (rec === 'Maybe') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

export default function FinalReview({ review, onRestart }: FinalReviewProps) {
  const { perQuestion, overall } = review;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Evaluation</h2>

        <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          <div className="text-center">
            <div className={`text-4xl font-bold ${overall.totalScore >= 70 ? 'text-green-600' : overall.totalScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {overall.totalScore}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Overall Score</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${recommendationColor(overall.hiringRecommendation)}`}>
            {overall.hiringRecommendation}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
            <ul className="space-y-1">
              {overall.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Weaknesses</h3>
            <ul className="space-y-1">
              {overall.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Senior Engineer Feedback</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{overall.seniorFeedback}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Per-Question Breakdown</h3>
        {perQuestion.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-4">
                <p className="text-xs font-medium text-gray-400 mb-1">Question {i + 1}</p>
                <p className="text-sm font-medium text-gray-900">{item.question}</p>
              </div>
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${scoreBg(item.score)} ${scoreColor(item.score)}`}>
                {item.score}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-400 mb-1">Your Answer</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                <p className="whitespace-pre-wrap">{item.answer || '(no answer)'}</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-400 mb-1">Ideal Answer</p>
              <div className="bg-indigo-50 rounded-lg px-3 py-2 text-sm text-indigo-800">
                <p className="whitespace-pre-wrap">{item.idealAnswer}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Strengths</p>
                <ul className="space-y-0.5">
                  {item.strengths.map((s, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">Weaknesses</p>
                <ul className="space-y-0.5">
                  {item.weaknesses.map((w, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-red-500">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-indigo-600 mb-1">Improvement Suggestion</p>
              <p className="text-sm text-gray-700">{item.suggestion}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
