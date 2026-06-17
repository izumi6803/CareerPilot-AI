const steps = [
  { key: 'upload-cv', label: 'Upload CV' },
  { key: 'job-description', label: 'Job Posting' },
  { key: 'analysis', label: 'Readiness' },
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'interview', label: 'Interview' },
  { key: 'final-review', label: 'Review' },
] as const;

interface HeaderProps {
  currentStep: string;
}

export default function Header({ currentStep }: HeaderProps) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">CareerPilot AI</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isCompleted ? 'bg-indigo-600 text-white' :
                    isCurrent ? 'bg-indigo-600 text-white ring-2 ring-indigo-200' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentIdx ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
