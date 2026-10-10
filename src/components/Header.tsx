import React from 'react';
import {
  FileCode2,
  History,
  ExternalLink,
} from 'lucide-react';
import { WebhookConfig } from '../types/resume';

interface HeaderProps {
  webhookConfig: WebhookConfig;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  webhookConfig,
  onOpenHistory,
  historyCount,
}) => {
  const isConnected = !!webhookConfig.url && webhookConfig.url.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-[#262626] flex items-center justify-center">
            <FileCode2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              CareerForge<span className="text-sky-400">.AI</span>
            </span>
            <span className="text-xs text-neutral-400 ml-2 hidden sm:inline font-normal">
              LaTeX Resume Tailoring
            </span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Status pill */}
          <div className="flex items-center space-x-1.5 text-xs">
            {isConnected ? (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>n8n Ready</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-400 border border-[#262626] font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Webhook Not Set</span>
              </span>
            )}
          </div>

          {/* Overleaf link */}
          <a
            href="https://www.overleaf.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Overleaf"
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition-all"
          >
            <span>Overleaf</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </a>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-200 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition-all"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-sky-600 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
