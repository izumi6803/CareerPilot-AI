import type { AnalysisResponse } from '../types';

interface AnalysisResultProps {
  analysis: AnalysisResponse;
  jobDescription: string;
  onBack: () => void;
  onRoadmap: () => void;
  onInterview: () => void;
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const bg = score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500';
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" className={bg} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className={`text-3xl font-bold -mt-24 ${color}`}>{score}%</span>
      <span className="text-sm text-gray-500 mt-1">Fit Score</span>
    </div>
  );
}

function Badge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${styles[level] ?? 'bg-gray-100 text-gray-800'}`}>
      {level.toUpperCase()} RISK
    </span>
  );
}

function ListCard({ title, items, color }: { title: string; items: string[]; color: 'green' | 'red' | 'blue' | 'purple' }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };
  const dotColors: Record<string, string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm opacity-75">None identified</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[color]}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalysisResult({ analysis, onBack, onRoadmap, onInterview }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply Readiness Analysis</h2>

        <div className="flex flex-col items-center mb-6">
          <ScoreGauge score={analysis.fitScore} />
        </div>

        <div className="flex justify-center mb-4">
          <Badge level={analysis.riskLevel} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-sm">{analysis.fitSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ListCard title="Strengths" items={analysis.strengths} color="green" />
          <ListCard title="Weaknesses" items={analysis.weaknesses} color="red" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ListCard title="Missing Skills" items={analysis.missingSkills} color="blue" />
          <ListCard title="Risk Signals" items={analysis.riskSignals} color="purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListCard title="CV Improvements" items={analysis.cvImprovements} color="blue" />
          <ListCard title="Must-Know Questions" items={analysis.mustKnowQuestions} color="purple" />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRoadmap}
            disabled={analysis.missingSkills.length === 0}
            className="px-5 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Generate Roadmap
          </button>
          <button
            type="button"
            onClick={onInterview}
            className="px-5 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
}
