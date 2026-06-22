import { useRef, useState } from 'react';
import { uploadCV } from '../services/api';

interface UploadCVProps {
  cvText: string;
  onCvText: (text: string) => void;
  onNext: () => void;
}

export default function UploadCV({ cvText, onCvText, onNext }: UploadCVProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const result = await uploadCV(file);
      onCvText(result.text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      if (msg.includes('scanned') || msg.includes('image-based')) {
        setError('Could not extract text from this PDF. Please upload a text-based PDF or paste manually.');
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Your CV</h2>
      <p className="text-gray-600 mb-4">Paste your CV text below or upload a file.</p>

      <div className="mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-indigo-600 font-medium hover:text-indigo-700 disabled:text-gray-400"
          >
            {uploading ? 'Uploading...' : 'Click to upload a file'}
          </button>
          <p className="text-sm text-gray-500 mt-1">or paste your CV below</p>
        </div>
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2 text-sm text-amber-800">
            {error}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-500 space-y-1">
        <p><span className="font-medium text-gray-700">Supported:</span> PDF (text-based), TXT</p>
        <p><span className="font-medium text-gray-700">Coming soon:</span> OCR support for scanned documents</p>
        <p className="pt-1 text-gray-400 italic">Your file is processed securely and not stored permanently.</p>
      </div>

      <textarea
        value={cvText}
        onChange={(e) => onCvText(e.target.value)}
        placeholder="Paste your CV text here..."
        rows={12}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
      />

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!cvText.trim()}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
