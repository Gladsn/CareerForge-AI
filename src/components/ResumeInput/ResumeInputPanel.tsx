import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { validateLatex } from '../../services/latexValidator';

interface ResumeInputPanelProps {
  latexCode: string;
  onChange: (code: string) => void;
}

export const ResumeInputPanel: React.FC<ResumeInputPanelProps> = ({
  latexCode,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validation = validateLatex(latexCode);
  const lineCount = latexCode ? latexCode.split('\n').length : 0;
  const charCount = latexCode.length;

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    if (!file.name.endsWith('.tex') && !file.name.endsWith('.txt')) {
      setUploadError('Please select a .tex or LaTeX text file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f] mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Master Resume (.tex)</h2>
            <p className="text-[11px] text-neutral-400">
              Upload your LaTeX master resume or paste code below
            </p>
          </div>
        </div>

        {latexCode && (
          <button
            onClick={() => onChange('')}
            className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
            title="Clear resume"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-2.5 mb-3 cursor-pointer transition-all flex items-center justify-between ${
          isDragging
            ? 'border-neutral-400 bg-neutral-900/60'
            : 'border-[#262626] hover:border-neutral-500 hover:bg-[#111111]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".tex,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        <div className="flex items-center space-x-2.5">
          <UploadCloud className="w-4 h-4 text-sky-400 shrink-0" />
          <p className="text-xs text-neutral-300">
            Drop your <code className="text-sky-300 font-mono">.tex</code> file here, or{' '}
            <span className="text-sky-400 underline font-medium">browse</span>
          </p>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono bg-[#161616] px-2 py-0.5 rounded border border-[#262626]">
          LaTeX .tex
        </span>
      </div>

      {uploadError && (
        <div className="mb-3 px-3 py-1.5 bg-rose-950/40 border border-rose-800/40 rounded-lg text-rose-300 text-xs">
          {uploadError}
        </div>
      )}

      {/* Code Editor */}
      <div className="relative flex-1 min-h-[360px] flex flex-col bg-[#111111] border border-[#222222] rounded-xl overflow-hidden focus-within:border-neutral-500 transition-colors">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#222222] text-[11px] text-neutral-400 font-mono">
          <span>master_resume.tex</span>
          <div className="flex items-center space-x-2">
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        <textarea
          value={latexCode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`\\documentclass{article}\n\\usepackage{hyperref}\n\\begin{document}\n\\section{Experience}\n% Paste your complete LaTeX resume code here...\n\\end{document}`}
          className="w-full flex-1 p-3 bg-transparent text-neutral-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-neutral-800 overflow-y-auto"
          spellCheck={false}
        />
      </div>

      {/* Status Footer */}
      {latexCode && (
        <div className="mt-2.5 flex items-center justify-between text-xs px-2.5 py-1.5 bg-[#141414] rounded-lg border border-[#222222]">
          <div className="flex items-center space-x-2">
            {validation.isValid ? (
              <span className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Valid LaTeX Structure</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-400 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{validation.warnings.filter((w) => w.severity === 'error').length} Issues</span>
              </span>
            )}
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 text-[11px]">
              {validation.stats.sectionCount} sections
            </span>
          </div>

          <span className="text-[11px] font-mono text-neutral-400">
            {validation.stats.documentClass !== 'Unknown' ? `class: ${validation.stats.documentClass}` : ''}
          </span>
        </div>
      )}
    </div>
  );
};
