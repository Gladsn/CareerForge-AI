import React from 'react';
import { RotateCcw } from 'lucide-react';

interface JobDescriptionPanelProps {
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
}

export const JobDescriptionPanel: React.FC<JobDescriptionPanelProps> = ({
  jobDescription,
  onJobDescriptionChange,
}) => {
  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f] mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Target Job Description</h2>
            <p className="text-[11px] text-neutral-400">
              Paste the complete role requirements, tech stack and responsibilities
            </p>
          </div>
        </div>

        {jobDescription && (
          <button
            onClick={() => onJobDescriptionChange('')}
            className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
            title="Clear job description"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Textarea */}
      <div className="relative flex-1 min-h-[360px] flex flex-col bg-[#111111] border border-[#222222] rounded-xl overflow-hidden focus-within:border-neutral-500 transition-colors">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#222222] text-[11px] text-neutral-400 font-mono">
          <span>job_description.txt</span>
          <span>{wordCount} words</span>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder={`Paste full job description here...\n\nInclude required tech stack, responsibilities, and qualifications.`}
          className="w-full flex-1 p-3.5 bg-transparent text-neutral-100 font-sans text-xs leading-relaxed resize-none focus:outline-none selection:bg-neutral-800 overflow-y-auto"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
