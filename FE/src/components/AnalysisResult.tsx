import type { AnalysisResponse, EvidenceGap } from '../types';

interface AnalysisResultProps {
  analysis: AnalysisResponse;
  onBack: () => void;
  onRoadmap: () => void;
  onInterview: () => void;
}

function fitLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Strong Fit', color: 'text-green-600', bg: 'bg-green-50' };
  if (score >= 60) return { label: 'Partial Fit', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (score >= 40) return { label: 'Weak Fit', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { label: 'Major Mismatch', color: 'text-red-600', bg: 'bg-red-50' };
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : score >= 40 ? 'text-orange-600' : 'text-red-600';
  const stroke = score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-yellow-500' : score >= 40 ? 'stroke-orange-500' : 'stroke-red-500';
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const { label } = fitLabel(score);

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" className={stroke} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className={`text-3xl font-bold -mt-24 ${color}`}>{score}%</span>
      <span className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function BreakdownCard({ label, score, subtitle }: { label: string; score: number; subtitle: string }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = score >= 70 ? 'text-green-700' : score >= 50 ? 'text-yellow-700' : 'text-red-700';
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="bg-gray-100 rounded-full h-1.5 mb-1">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-gray-400 truncate">{subtitle}</p>
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
  const sourceLabel: Record<string, string> = {
    skills: 'Skills',
    project: 'Project',
    experience: 'Work',
    none: 'Not Found',
  };
  const sourceColors: Record<string, string> = {
    skills: 'bg-gray-100 text-gray-600',
    project: 'bg-blue-100 text-blue-700',
    experience: 'bg-purple-100 text-purple-700',
    none: 'bg-red-100 text-red-600',
  };
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-800 w-1/3 shrink-0 font-medium truncate">{gap.skill}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${strengthColors[gap.strength]} ${strengthWidth[gap.strength]}`} />
      </div>
      <span className={`text-xs font-bold w-14 text-right shrink-0 ${gap.strength === 'Strong' ? 'text-green-600' : gap.strength === 'Medium' ? 'text-yellow-600' : gap.strength === 'Weak' ? 'text-orange-600' : 'text-red-600'}`}>
        {gap.strength}
      </span>
      <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${sourceColors[gap.evidenceSource] ?? 'bg-gray-100 text-gray-500'}`}>
        {sourceLabel[gap.evidenceSource] ?? gap.evidenceSource}
      </span>
    </div>
  );
}

function estimateBreakdown(analysis: AnalysisResponse) {
  const gaps = analysis.evidenceGaps;
  const total = gaps.length || 1;

  const skillStrong = gaps.filter(g => g.strength === 'Strong').length;
  const skillMedium = gaps.filter(g => g.strength === 'Medium').length;
  const skillMatch = Math.round(((skillStrong * 1 + skillMedium * 0.5) / total) * 100);

  const seniorityScore = analysis.interviewRisk === 'low' ? 80 : analysis.interviewRisk === 'medium' ? 50 : 20;
  const seniorityAdj = analysis.decision.action === 'AVOID_FOR_NOW' ? -20 : analysis.decision.action === 'IMPROVE_FIRST' ? -10 : 0;
  const seniorityMatch = Math.max(0, Math.min(100, seniorityScore + seniorityAdj));

  const prodGaps = gaps.filter(g => /test|ci|cd|deploy|performance|scale|production/i.test(g.skill));
  const prodStrong = prodGaps.filter(g => g.strength === 'Strong').length;
  const prodScore = prodGaps.length > 0 ? Math.round((prodStrong / prodGaps.length) * 100) : 30;
  const productionExp = Math.max(0, Math.min(100, prodScore));

  const respGaps = gaps.filter(g => /lead|mentor|architect|ownership|collaborat|team/i.test(g.skill));
  const respStrong = respGaps.filter(g => g.strength === 'Strong').length;
  const respScore = respGaps.length > 0 ? Math.round((respStrong / respGaps.length) * 100) : 30;
  const responsibility = Math.max(0, Math.min(100, respScore));

  return { skillMatch, seniorityMatch, productionExp, responsibility };
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
  const { skillMatch, seniorityMatch, productionExp, responsibility } = estimateBreakdown(analysis);

  const mainGap = analysis.evidenceGaps
    .filter(g => g.strength === 'Missing' || g.strength === 'Weak')
    .sort((a, b) => {
      const order = { Missing: 0, Weak: 1, Medium: 2, Strong: 3 };
      return order[a.strength] - order[b.strength];
    })[0];

  return (
    <div className="space-y-5">
      {/* A. Large Fit Score Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreGauge score={analysis.fitScore} />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fit Assessment</h2>
            <p className="text-sm text-gray-700">{analysis.fitSummary}</p>
          </div>
        </div>
      </div>

      {/* B. Score Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BreakdownCard label="Skill Match" score={skillMatch} subtitle="Technologies & frameworks" />
        <BreakdownCard label="Seniority Match" score={seniorityMatch} subtitle="Experience level fit" />
        <BreakdownCard label="Production Exp" score={productionExp} subtitle="Real-world systems" />
        <BreakdownCard label="Responsibility" score={responsibility} subtitle="Ownership & leadership" />
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Result Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Recommended Action</p>
            <span className={`inline-block text-sm font-bold px-2.5 py-1 rounded-md ${decisionStyles[analysis.decision.action] ?? 'bg-gray-100 text-gray-800'}`}>
              {analysis.decision.action.replace(/_/g, ' ')}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Fit Score</p>
            <p className={`text-xl font-bold ${analysis.fitScore >= 80 ? 'text-green-600' : analysis.fitScore >= 60 ? 'text-yellow-600' : analysis.fitScore >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
              {analysis.fitScore}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Main Gap</p>
            <p className="text-sm font-medium text-gray-800">{mainGap?.skill ?? 'None'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Risk Level</p>
            <Badge level={analysis.riskLevel} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Interview Risk</p>
            <Badge level={analysis.interviewRisk} />
          </div>
        </div>
      </div>

      {/* Decision Engine */}
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

      {/* Evidence Gap */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Evidence Gap Analysis</h2>
        <p className="text-xs text-gray-500 mb-3">How well your CV proves each required skill</p>
        <div className="flex gap-2 mb-3 text-xs">
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">Work</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">Project</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">Skills</span>
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">Not Found</span>
        </div>
        {analysis.evidenceGaps.map((gap, i) => (
          <div key={i}>
            <EvidenceGapBar gap={gap} />
            <p className="text-xs text-gray-500 ml-[33%] pb-2 -mt-1">{gap.reason}</p>
          </div>
        ))}
      </div>

      {/* Risk */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Job Posting Risk</h2>
          <Badge level={analysis.riskLevel} />
        </div>
        <ListCard title="Risk Signals" items={analysis.riskSignals} color="amber" compact />
      </div>

      {/* Company Context */}
      {analysis.companyContext && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Company Context</h2>
          <div className="space-y-3 mb-3">
            <div className="rounded-lg border bg-blue-50 border-blue-200 text-blue-800 p-3">
              <h3 className="font-semibold text-sm mb-1">Online Presence</h3>
              <p className="text-sm">{analysis.companyContext.onlinePresence}</p>
            </div>
            <ListCard title="Public Signals" items={analysis.companyContext.publicSignals} color="amber" compact />
            <div className="rounded-lg border bg-purple-50 border-purple-200 text-purple-800 p-3">
              <h3 className="font-semibold text-sm mb-1">Engineering Visibility</h3>
              <p className="text-sm">{analysis.companyContext.engineeringVisibility}</p>
            </div>
            <div className="rounded-lg border bg-green-50 border-green-200 text-green-800 p-3">
              <h3 className="font-semibold text-sm mb-1">Transparency</h3>
              <p className="text-sm">{analysis.companyContext.transparency}</p>
            </div>
            <ListCard title="Concerns" items={analysis.companyContext.concerns} color="red" compact />
          </div>
          <p className="text-xs text-gray-400 italic">{analysis.companyContext.disclaimer}</p>
        </div>
      )}

      {/* CV Improvements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Before Applying — CV Improvements</h2>
        <ListCard title="" items={analysis.cvImprovements} color="blue" compact />
      </div>

      {/* Strengths / Weaknesses */}
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
