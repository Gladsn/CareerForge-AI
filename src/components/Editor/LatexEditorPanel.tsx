import React, { useState } from 'react';
import {
  Copy,
  Download,
  ExternalLink,
  Check,
  FileCode,
  FileDiff,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { openInOverleaf, downloadTexFile } from '../../services/overleafExport';
import { computeSimpleDiff, DiffLine } from '../../services/diffHelper';

interface LatexEditorPanelProps {
  tailoredTex: string;
  masterTex: string;
  onUpdateTailoredTex: (newTex: string) => void;
}

export const LatexEditorPanel: React.FC<LatexEditorPanelProps> = ({
  tailoredTex,
  masterTex,
  onUpdateTailoredTex,
}) => {
  const [activeView, setActiveView] = useState<'tailored' | 'diff' | 'master'>('tailored');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const filename = 'Tailored_Resume.tex';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tailoredTex);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    downloadTexFile(filename, tailoredTex);
  };

  const handleOverleaf = () => {
    openInOverleaf(tailoredTex, 'Tailored_Resume');
  };

  const lines = tailoredTex ? tailoredTex.split('\n') : [];
  const diffLines: DiffLine[] = computeSimpleDiff(masterTex || '', tailoredTex || '');

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1f1f1f]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white">LaTeX Resume Output</h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                Compilable
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Ready for Overleaf or your local pdflatex compiler
            </p>
          </div>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-[#262626] text-xs">
          <button
            onClick={() => setActiveView('tailored')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'tailored'
                ? 'bg-[#222222] text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="View the generated tailored LaTeX resume"
          >
            Tailored Code
          </button>
          <button
            onClick={() => setActiveView('diff')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeView === 'diff'
                ? 'bg-[#222222] text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="View differences between original master and tailored code"
          >
            <FileDiff className="w-3.5 h-3.5" />
            <span>Diff View</span>
          </button>
          <button
            onClick={() => setActiveView('master')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'master'
                ? 'bg-[#222222] text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="View your original master LaTeX resume"
          >
            Original Master
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeView === 'tailored' && (
            <button
              onClick={() => setIsEditable(!isEditable)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isEditable
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#141414] hover:bg-[#1a1a1a] text-neutral-300 border-[#262626]'
              }`}
              title="Toggle in-place editing"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditable ? 'Done Editing' : 'Edit Code'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] hover:bg-[#1a1a1a] text-neutral-200 hover:text-white border border-[#262626] transition-all"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copy LaTeX</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] hover:bg-[#1a1a1a] text-neutral-200 hover:text-white border border-[#262626] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download .tex</span>
          </button>

          <button
            onClick={handleOverleaf}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm border border-emerald-500/40 transition-all"
            title="Open directly in Overleaf online editor"
          >
            <span>Open in Overleaf</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="relative rounded-xl overflow-hidden bg-[#0d0d0d] border border-[#222222] font-mono text-xs">
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#141414] border-b border-[#222222] text-[11px] text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-300 font-semibold">{filename}</span>
            <span>•</span>
            <span>{lines.length} lines</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            {isEditable && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                Interactive Edit Mode
              </span>
            )}
            <span className="text-neutral-500">UTF-8</span>
          </div>
        </div>

        {/* Tailored Code View */}
        {activeView === 'tailored' && (
          <div className="max-h-[550px] overflow-y-auto">
            {isEditable ? (
              <textarea
                value={tailoredTex}
                onChange={(e) => onUpdateTailoredTex(e.target.value)}
                className="w-full min-h-[480px] p-4 bg-transparent text-neutral-100 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-neutral-800"
                spellCheck={false}
              />
            ) : (
              <div className="flex select-text">
                {/* Line Numbers */}
                <div className="bg-[#111111] py-4 px-3 text-right select-none text-neutral-600 border-r border-[#222222] text-[11px] font-mono shrink-0 min-w-[3rem]">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-relaxed">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Code */}
                <pre className="p-4 overflow-x-auto flex-1 text-neutral-200 leading-relaxed font-mono whitespace-pre text-xs">
                  <code>
                    {lines.map((line, idx) => {
                      const isComment = line.trim().startsWith('%');
                      const isCommand = line.includes('\\');
                      return (
                        <div
                          key={idx}
                          className={`${
                            isComment
                              ? 'text-neutral-500 italic'
                              : isCommand
                              ? 'text-sky-300'
                              : 'text-neutral-200'
                          }`}
                        >
                          {line || ' '}
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Diff View */}
        {activeView === 'diff' && (
          <div className="max-h-[550px] overflow-y-auto p-4 space-y-0.5 select-text">
            {diffLines.map((dl, i) => {
              if (dl.type === 'added') {
                return (
                  <div
                    key={i}
                    className="flex items-start bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded font-mono text-[11px]"
                  >
                    <span className="text-emerald-500 w-6 shrink-0 font-bold">+</span>
                    <span className="flex-1 whitespace-pre-wrap">{dl.tailoredLine}</span>
                  </div>
                );
              }
              if (dl.type === 'removed') {
                return (
                  <div
                    key={i}
                    className="flex items-start bg-rose-950/30 text-rose-300 px-2 py-0.5 rounded font-mono text-[11px]"
                  >
                    <span className="text-rose-500 w-6 shrink-0 font-bold">-</span>
                    <span className="flex-1 whitespace-pre-wrap">{dl.masterLine}</span>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="flex items-start text-neutral-400 px-2 py-0.5 font-mono text-[11px]"
                >
                  <span className="text-neutral-600 w-6 shrink-0 font-mono"> </span>
                  <span className="flex-1 whitespace-pre-wrap">{dl.masterLine}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Master Code View */}
        {activeView === 'master' && (
          <div className="max-h-[550px] overflow-y-auto p-4 select-text">
            <pre className="text-neutral-300 leading-relaxed font-mono whitespace-pre text-xs">
              <code>{masterTex}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Tip footer */}
      <div className="p-3 bg-[#111111] rounded-xl border border-[#222222] text-xs text-neutral-400 flex items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>
          <strong>Compile in Overleaf:</strong> Click <em>Open in Overleaf</em>, or click{' '}
          <em>Copy LaTeX</em> and paste into any Overleaf project.
        </span>
      </div>
    </div>
  );
};
