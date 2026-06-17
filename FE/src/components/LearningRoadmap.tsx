import type { RoadmapResponse } from '../types';

interface LearningRoadmapProps {
  roadmap: RoadmapResponse;
  onBack: () => void;
  onInterview: () => void;
}

export default function LearningRoadmap({ roadmap, onBack, onInterview }: LearningRoadmapProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">4-Week Learning Roadmap</h2>
      <p className="text-gray-600 mb-6">Follow this plan to bridge your skill gaps.</p>

      <div className="space-y-4">
        {roadmap.weeks.map((week) => (
          <div key={week.week} className="relative pl-8 border-l-2 border-indigo-200">
            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{week.week}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 ml-2">
              <h3 className="font-semibold text-gray-900 mb-1">Week {week.week}: {week.focus}</h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {week.topics.map((topic, i) => (
                  <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
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
