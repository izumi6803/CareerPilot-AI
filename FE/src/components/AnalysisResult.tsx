import type { AnalysisResponse, EvidenceGap } from '../types';

interface AnalysisResultProps {
  analysis: AnalysisResponse;
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
      <svg width="120" height="120" className="transform -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" className={bg} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className={`text-2xl font-bold -mt-20 ${color}`}>{score}%</span>
      <span className="text-xs text-gray-500 mt-1">Fit Score</span>
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

function ListCard({ title, items, color, compact }: { title: string; items: string[]; color: 'green' | 'red' | 'blue' | 'purple' | 'amber'; compact?: boolean }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  const dotColors: Record<string, string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className={`rounded-lg border ${colors[color]} ${compact ? 'p-3' : 'p-4'}`}>
      <h3 className={`font-semibold mb-2 ${compact ? 'text-sm' : ''}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm opacity-75">None identified</p>
      ) : (
        <ul className="space-y-1">
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

function EvidenceGapBar({ gap }: { gap: EvidenceGap }) {
  const strengthColors: Record<string, string> = {
    Strong: 'bg-green-500',
    Medium: 'bg-yellow-500',
    Weak: 'bg-orange-500',
    Missing: 'bg-red-500',
  };
  const strengthWidth: Record<string, string> = {
    Strong: 'w-full',
    Medium: 'w-3/4',
    Weak: 'w-2/5',
    Missing: 'w-1/5',
  };
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-800 w-1/3 shrink-0 font-medium">{gap.skill}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${strengthColors[gap.strength]} ${strengthWidth[gap.strength]}`} />
      </div>
      <span className={`text-xs font-bold w-16 text-right ${gap.strength === 'Strong' ? 'text-green-600' : gap.strength === 'Medium' ? 'text-yellow-600' : gap.strength === 'Weak' ? 'text-orange-600' : 'text-red-600'}`}>
        {gap.strength}
      </span>
    </div>
  );
}

export default function AnalysisResult({ analysis, onBack, onRoadmap, onInterview }: AnalysisResultProps) {
  const decisionStyles: Record<string, string> = {
    APPLY_NOW: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    IMPROVE_FIRST: 'bg-amber-50 border-amber-300 text-amber-800',
    AVOID_FOR_NOW: 'bg-red-50 border-red-300 text-red-800',
  };
  const confidenceLabel: Record<string, string> = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  };

  return (
    <div className="space-y-5">
      {/* Priority 1: Fit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-6">
          <ScoreGauge score={analysis.fitScore} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fit Assessment</h2>
            <p className="text-sm text-gray-700">{analysis.fitSummary}</p>
          </div>
        </div>
      </div>

      {/* Priority 2: Decision Engine (visually highlighted) */}
      <div className={`rounded-xl shadow-sm border-2 p-5 ${decisionStyles[analysis.decision.action] ?? 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Decision Engine</h2>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/60 border">
            {confidenceLabel[analysis.decision.confidence] ?? analysis.decision.confidence}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold">{analysis.decision.action.replace(/_/g, ' ')}</span>
        </div>
        <p className="text-sm opacity-80">{analysis.decision.reason}</p>
      </div>

      {/* Priority 3: Evidence Gap */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Evidence Gap Analysis</h2>
        <p className="text-xs text-gray-500 mb-3">How well your CV proves each required skill</p>
        {analysis.evidenceGaps.map((gap, i) => (
          <div key={i}>
            <EvidenceGapBar gap={gap} />
            <p className="text-xs text-gray-500 ml-[33%] pb-2 -mt-1">{gap.reason}</p>
          </div>
        ))}
      </div>

      {/* Priority 4: Risk */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Job Posting Risk</h2>
          <Badge level={analysis.riskLevel} />
        </div>
        <ListCard title="Risk Signals" items={analysis.riskSignals} color="amber" compact />
      </div>

      {/* Priority 5: Before Applying Improvements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Before Applying — CV Improvements</h2>
        <ListCard title="" items={analysis.cvImprovements} color="blue" compact />
      </div>

      {/* Secondary sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Strengths" items={analysis.strengths} color="green" />
        <ListCard title="Weaknesses" items={analysis.weaknesses} color="red" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Missing Skills" items={analysis.missingSkills} color="blue" />
        <ListCard title="Must-Know Questions" items={analysis.mustKnowQuestions} color="purple" />
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
