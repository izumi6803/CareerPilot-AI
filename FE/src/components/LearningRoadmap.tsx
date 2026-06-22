import type { RoadmapResponse } from '../types';

interface LearningRoadmapProps {
  roadmap: RoadmapResponse;
  onBack: () => void;
  onInterview: () => void;
}

const MILESTONES = [
  { label: 'Now', icon: '●' },
  { label: 'Skill Gap', icon: '▸' },
  { label: 'Build Experience', icon: '▸' },
  { label: 'Interview Ready', icon: '▸' },
  { label: 'Target Role', icon: '★' },
];

export default function LearningRoadmap({ roadmap, onBack, onInterview }: LearningRoadmapProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">4-Week Learning Roadmap</h2>
      <p className="text-gray-600 mb-6">Follow this plan to bridge your skill gaps.</p>

      {/* Timeline milestones */}
      <div className="flex items-center justify-between mb-6 px-2">
        {MILESTONES.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${i === 0 ? 'bg-indigo-600 text-white' :
                i === MILESTONES.length - 1 ? 'bg-emerald-500 text-white' :
                'bg-gray-100 text-gray-500'}`}>
              {m.icon}
            </span>
            <span className="text-xs font-medium text-gray-600">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Connecting line */}
      <div className="relative h-0.5 bg-gray-200 -mt-5 mb-6 mx-4">
        <div className="absolute h-0.5 bg-indigo-400 rounded-full" style={{ width: `${(roadmap.weeks.length / 4) * 100}%` }} />
      </div>

      <div className="space-y-4">
        {roadmap.weeks.map((week, wi) => (
          <div key={week.week}>
            {/* Week header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-indigo-700 text-sm font-bold">{week.week}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Week {week.week}</h3>
                <p className="text-xs text-gray-500">{week.focus}</p>
              </div>
            </div>

            {/* Content card */}
            <div className="ml-10 border-l-2 border-indigo-100 pl-4 pb-4">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {week.topics.map((topic, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                    {topic}
                  </span>
                ))}
              </div>
              {week.resources.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resources</p>
                  <ul className="space-y-1">
                    {week.resources.map((r, i) => (
                      <li key={i}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                          {r.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Analysis
        </button>
        <button
          type="button"
          onClick={onInterview}
          className="px-5 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Try Mock Interview
        </button>
      </div>
    </div>
  );
}
