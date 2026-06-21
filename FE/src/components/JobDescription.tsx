interface JobDescriptionProps {
  value: string;
  onChange: (text: string) => void;
  companyName: string;
  onCompanyNameChange: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
  onUseSampleData: () => void;
}

export default function JobDescription({ value, onChange, companyName, onCompanyNameChange, onBack, onNext, onUseSampleData }: JobDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Job Posting</h2>
          <p className="text-gray-600 mt-1">Paste the full job posting you want to target.</p>
        </div>
        <button
          type="button"
          onClick={onUseSampleData}
          className="text-sm px-3 py-1.5 rounded-lg font-medium text-indigo-600 border border-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          Use Sample Data
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g. TechGrowth Inc."
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">Used for company context insights (online presence, reviews, etc.)</p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job posting here..."
        rows={12}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!value.trim()}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Fit
        </button>
      </div>
    </div>
  );
}
