import type { MockReviewResponse } from '../types';

interface FinalReviewProps {
  review: MockReviewResponse;
  onRestart: () => void;
  onChangeJob: () => void;
  onChangeCV: () => void;
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

function riskBadgeColor(category: string): string {
  const styles: Record<string, string> = {
    technical: 'bg-blue-100 text-blue-800 border-blue-200',
    communication: 'bg-purple-100 text-purple-800 border-purple-200',
    confidence: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return styles[category] ?? 'bg-gray-100 text-gray-800 border-gray-200';
}

function riskLevelColor(risk: string): string {
  const styles: Record<string, string> = {
    high: 'text-red-700 bg-red-50 border-red-200',
    medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    low: 'text-green-700 bg-green-50 border-green-200',
  };
  return styles[risk] ?? 'bg-gray-50 text-gray-700 border-gray-200';
}

function recommendationColor(rec: string): string {
  if (rec.startsWith('Strong Yes') || rec.startsWith('Yes')) return 'text-green-700 bg-green-50 border-green-200';
  if (rec === 'Maybe') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-36 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold w-10 text-right ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
        {score}
      </span>
    </div>
  );
}

export default function FinalReview({ review, onRestart, onChangeJob, onChangeCV }: FinalReviewProps) {
  const { perQuestion, overall } = review;

  return (
    <div className="space-y-6">
      {/* A. Performance Summary Card */}
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

        <div className="space-y-2">
          <ScoreBar label="Technical Score" score={overall.technicalScore} />
          <ScoreBar label="Communication Score" score={overall.communicationScore} />
          <ScoreBar label="Confidence Score" score={overall.confidenceScore} />
        </div>
      </div>

      {/* B. Strengths Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <ul className="space-y-1">
            {overall.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* C. Weaknesses Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Weaknesses</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

      {/* D. Suggested Better Answers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Suggested Better Answers</h2>
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
              <p className="text-xs font-medium text-indigo-500 mb-1">Ideal Answer</p>
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

      {/* Senior feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Senior Engineer Feedback</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{overall.seniorFeedback}</p>
        </div>
      </div>

      {/* Interview Risk Prediction */}
      {review.interviewRiskPrediction && review.interviewRiskPrediction.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Interview Risk Prediction</h2>
          <p className="text-xs text-gray-500 mb-3">Likely fail points in a real interview setting</p>
          <div className="space-y-3">
            {review.interviewRiskPrediction.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${riskBadgeColor(item.category)}`}>
                  {item.category}
                </span>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${riskLevelColor(item.risk)}`}>
                  {item.risk.toUpperCase()}
                </span>
                <p className="text-sm text-gray-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onChangeJob}
            className="px-5 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Try Another Job
          </button>
          <button
            onClick={onChangeCV}
            className="px-5 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Upload Another CV
          </button>
          <button
            disabled
            className="px-5 py-2 rounded-lg font-medium text-gray-400 border border-gray-200 cursor-not-allowed"
            title="Coming soon"
          >
            Book Senior Review (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
