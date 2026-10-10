import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { WebhookConfig } from '../../types/resume';

interface TailoringControlsProps {
  onGenerate: () => void;
  isLoading: boolean;
  loadingStage: string;
  hasResume: boolean;
  hasJobDescription: boolean;
  webhookConfig: WebhookConfig;
}

export const TailoringControls: React.FC<TailoringControlsProps> = ({
  onGenerate,
  isLoading,
  loadingStage,
  hasResume,
  hasJobDescription,
  webhookConfig,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setElapsed(0);
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const hasWebhook = !!webhookConfig.url && webhookConfig.url.trim().length > 0;
  const canSubmit = hasResume && hasJobDescription && hasWebhook && !isLoading;

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Anti-Hallucination notice */}
        <div className="flex items-center space-x-2.5 text-xs text-neutral-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">
              Zero-Hallucination Guarantee
            </p>
            <p className="text-[11px] text-neutral-400">
              Only verified credentials from your master LaTeX will be tailored. Unmet requirements are flagged as gaps.
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={onGenerate}
            disabled={!canSubmit}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              !canSubmit
                ? 'bg-[#161616] text-neutral-500 border border-[#262626] cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200 shadow-white/5 border border-white hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span className="font-mono">
                  Tailoring resume ({formatTimer(elapsed)})
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Tailor Resume via n8n</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Messages if incomplete */}
      {!canSubmit && !isLoading && (
        <div className="mt-3 pt-2.5 border-t border-[#1f1f1f] flex items-center space-x-2 text-[11px] text-neutral-400">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {!hasWebhook
              ? 'Please enter your n8n Webhook URL above.'
              : !hasResume && !hasJobDescription
              ? 'Please upload/paste your Master Resume and target Job Description.'
              : !hasResume
              ? 'Please upload/paste your Master Resume in Section 1.'
              : 'Please paste the target Job Description in Section 2.'}
          </span>
        </div>
      )}

      {/* Loading Progress State */}
      {isLoading && (
        <div className="mt-3 pt-3 border-t border-[#1f1f1f] animate-fadeIn space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-neutral-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="font-semibold text-white">
                Tailoring in progress (5 min timeout)...
              </span>
            </div>
            <span className="font-mono text-neutral-400 bg-[#141414] px-2.5 py-0.5 rounded border border-[#222222] text-[11px] flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Elapsed: {formatTimer(elapsed)}</span>
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Your n8n AI workflow is analyzing requirements, matching credentials, and synthesizing compilable LaTeX code. Please keep this tab open.
          </p>

          <div className="w-full bg-[#181818] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};
