import React, { useState } from 'react';
import {
  PlugZap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Key,
  Copy,
  Check,
} from 'lucide-react';
import { WebhookConfig } from '../types/resume';
import { ApiService } from '../services/api';

interface ConnectionBarProps {
  config: WebhookConfig;
  onUpdateConfig: (config: WebhookConfig) => void;
}

export const ConnectionBar: React.FC<ConnectionBarProps> = ({ config, onUpdateConfig }) => {
  const [url, setUrl] = useState(config.url || '');
  const [authToken, setAuthToken] = useState(config.authToken || '');
  const [authHeaderName, setAuthHeaderName] = useState(config.authHeaderName || 'Authorization');
  const [isExpanded, setIsExpanded] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleSave = (newUrl: string, newAuthToken: string, newHeader: string) => {
    const updated = {
      ...config,
      url: newUrl,
      authToken: newAuthToken,
      authHeaderName: newHeader,
      isLiveMode: true,
    };
    onUpdateConfig(updated);
  };

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await ApiService.testConnection({
        ...config,
        url: url.trim(),
        authToken: authToken.trim(),
        authHeaderName: authHeaderName.trim(),
      });
      setTestResult(res);
      if (res.ok) {
        handleSave(url.trim(), authToken.trim(), authHeaderName.trim());
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const samplePrompt = `You are CareerForge AI, a specialized LaTeX resume tailoring engine.
Strict zero-hallucination rule: Adapt, rephrase and prioritize existing credentials only. NEVER fabricate jobs, dates, or metrics. List any unmet JD requirements in "missingRequirements".
Output JSON schema:
{
  "tailoredLatex": "complete compilable LaTeX string starting with \\documentclass and ending with \\end{document}",
  "matchScore": 85,
  "summary": "Executive summary of match",
  "matchedRequirements": [{"id":"1","requirement":"Skill","sourceEvidence":"Quote from resume"}],
  "missingRequirements": [{"id":"1","requirement":"Tool","recommendation":"Advice"}],
  "tailoringRecommendations": [{"id":"1","area":"Section","suggestion":"Tip"}],
  "changesApplied": [{"id":"1","section":"Exp","reasoning":"..."}]
}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(samplePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1f1f1f] px-4 py-3">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Main URL Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 shrink-0">
            <PlugZap className="w-4 h-4 text-sky-400" />
            <span>n8n Webhook:</span>
          </div>

          {/* URL Input */}
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                handleSave(e.target.value, authToken, authHeaderName);
              }}
              placeholder="Paste your n8n Production Webhook URL (e.g. https://your-domain.app.n8n.cloud/webhook/careerforge-tailor)"
              className="w-full px-3 py-1.5 bg-[#111111] border border-[#222222] focus:border-neutral-500 rounded-lg text-xs text-white placeholder-neutral-500 font-mono focus:outline-none transition-colors"
            />
          </div>

          {/* Test & Expand Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleTest}
              disabled={testing || !url.trim()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                testing || !url.trim()
                  ? 'bg-[#181818] text-neutral-500 border border-[#222222] cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
              }`}
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Test Webhook</span>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] flex items-center space-x-1 transition-colors"
              title="Auth headers & n8n setup guide"
            >
              <Key className="w-3 h-3 text-neutral-400" />
              <span>Auth & Info</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-2 rounded-lg text-xs flex items-center justify-between ${
              testResult.ok
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
            }`}
          >
            <div className="flex items-center space-x-2">
              {testResult.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-neutral-400 hover:text-white ml-2 text-[11px]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Expanded Auth & Setup Tray */}
        {isExpanded && (
          <div className="p-3 bg-[#111111] rounded-xl border border-[#222222] space-y-3 animate-fadeIn text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1 text-[11px]">
                  Header Name (Optional)
                </label>
                <input
                  type="text"
                  value={authHeaderName}
                  onChange={(e) => {
                    setAuthHeaderName(e.target.value);
                    handleSave(url, authToken, e.target.value);
                  }}
                  placeholder="Authorization"
                  className="w-full px-2.5 py-1.5 bg-[#161616] border border-[#262626] rounded-lg text-xs text-neutral-200 font-mono focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1 text-[11px]">
                  Auth Token / Secret (Optional)
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => {
                    setAuthToken(e.target.value);
                    handleSave(url, e.target.value, authHeaderName);
                  }}
                  placeholder="Bearer token or custom API key"
                  className="w-full px-2.5 py-1.5 bg-[#161616] border border-[#262626] rounded-lg text-xs text-neutral-200 font-mono focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {/* Quick n8n Setup Instructions */}
            <div className="pt-2 border-t border-[#1f1f1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400">
              <div>
                <strong className="text-neutral-200">n8n Tip:</strong> In your Webhook node, set HTTP Method to{' '}
                <code className="text-sky-300 bg-neutral-900 px-1 rounded">POST</code>, Response Mode to{' '}
                <code className="text-sky-300 bg-neutral-900 px-1 rounded">Using Respond to Webhook</code>, and enable{' '}
                <code className="text-sky-300 bg-neutral-900 px-1 rounded">Allowed Origins (CORS): *</code>.
              </div>

              <button
                onClick={handleCopyPrompt}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#181818] hover:bg-[#222222] text-sky-300 border border-[#2b2b2b] rounded-lg shrink-0 transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-neutral-400" />
                    <span>Copy n8n LLM Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
