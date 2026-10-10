import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileDiff,
  Sparkles,
} from 'lucide-react';
import { AnalysisResult } from '../../types/resume';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const {
    matchScore,
    summary,
    matchedRequirements,
    missingRequirements,
    tailoringRecommendations,
    changesApplied,
  } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/30';
    if (score >= 65) return 'text-sky-400 border-sky-800/60 bg-sky-950/30';
    return 'text-amber-400 border-amber-800/60 bg-amber-950/30';
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 shadow-xl space-y-5">
      {/* Score & Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-[#1f1f1f]">
        {/* Score Badge */}
        <div
          className={`px-4 py-3 rounded-xl border flex items-center space-x-3 shrink-0 ${getScoreColor(
            matchScore
          )}`}
        >
          <span className="text-3xl font-extrabold font-mono">{matchScore}%</span>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider block text-neutral-400">
              Match Score
            </span>
            <span className="text-xs font-semibold">
              {matchScore >= 80 ? 'Strong Alignment' : matchScore >= 60 ? 'Moderate Fit' : 'Review Gaps'}
            </span>
          </div>
        </div>

        {/* Summary text */}
        <div className="flex-1 text-xs text-neutral-300 leading-relaxed bg-[#111111] p-3 rounded-xl border border-[#222222]">
          <div className="flex items-center space-x-1.5 text-sky-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Summary:</span>
          </div>
          <p>{summary}</p>
        </div>
      </div>

      {/* 2-Column Requirements Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Matched Requirements */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Matched Requirements ({matchedRequirements.length})</span>
          </h3>

          {matchedRequirements.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-3 bg-[#111111] rounded-xl border border-[#222222]">
              No explicit matches extracted.
            </p>
          ) : (
            <div className="space-y-2">
              {matchedRequirements.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-2.5 bg-[#111111] border border-emerald-900/40 rounded-xl text-xs space-y-1"
                >
                  <p className="font-semibold text-emerald-300">{m.requirement}</p>
                  {m.sourceEvidence && (
                    <p className="text-[11px] text-neutral-400 pl-2 border-l border-emerald-800/60">
                      {m.sourceEvidence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Requirements (Honest Gaps) */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Missing Requirements / Gaps ({missingRequirements.length})</span>
          </h3>

          {missingRequirements.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-3 bg-[#111111] rounded-xl border border-[#222222]">
              Zero qualification gaps detected.
            </p>
          ) : (
            <div className="space-y-2">
              {missingRequirements.map((miss, idx) => (
                <div
                  key={miss.id || idx}
                  className="p-2.5 bg-[#111111] border border-amber-900/40 rounded-xl text-xs space-y-1"
                >
                  <p className="font-semibold text-amber-300">{miss.requirement}</p>
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-amber-400/90">Advice:</strong> {miss.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations & What Changed */}
      {(tailoringRecommendations.length > 0 || changesApplied.length > 0) && (
        <div className="pt-3 border-t border-[#1f1f1f] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {tailoringRecommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Tailoring Recommendations:</span>
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-neutral-400 text-[11px]">
                {tailoringRecommendations.map((r, i) => (
                  <li key={i}>
                    <strong className="text-neutral-300">{r.area}:</strong> {r.suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {changesApplied.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <FileDiff className="w-3.5 h-3.5 text-sky-400" />
                <span>Adjustments Applied:</span>
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-neutral-400 text-[11px]">
                {changesApplied.map((ch, i) => (
                  <li key={i}>
                    <strong className="text-neutral-300">{ch.section}:</strong> {ch.reasoning || ch.tailoredSnippet}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
