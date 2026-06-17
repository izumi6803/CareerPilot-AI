interface JobDescriptionProps {
  value: string;
  onChange: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function JobDescription({ value, onChange, onBack, onNext }: JobDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Posting</h2>
      <p className="text-gray-600 mb-6">Paste the full job posting you want to target.</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job posting here..."
        rows={14}
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
