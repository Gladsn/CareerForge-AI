import React from 'react';
import { Info, PlugZap, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { WebhookConfig } from '../types/resume';

interface DemoBannerProps {
  webhookConfig: WebhookConfig;
  onOpenSettings: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ webhookConfig, onOpenSettings }) => {
  if (webhookConfig.isLiveMode && webhookConfig.url) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <PlugZap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Live Mode Active:</strong> Sending LaTeX and Job Descriptions to n8n Webhook at{' '}
              <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-200 font-mono text-[11px]">
                {webhookConfig.url.length > 50 ? `${webhookConfig.url.slice(0, 50)}...` : webhookConfig.url}
              </code>
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-emerald-400 hover:text-emerald-200 underline font-medium shrink-0 ml-4"
          >
            Manage Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-sky-950/40 to-indigo-950/40 border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-200">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p>
            <strong className="text-amber-300">DEMO MODE ACTIVE:</strong> The application is currently
            simulating AI tailoring using pre-verified LaTeX templates and strict zero-hallucination analysis.
          </p>
        </div>
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-medium transition-colors shrink-0"
        >
          <span>Connect n8n Cloud Webhook</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
