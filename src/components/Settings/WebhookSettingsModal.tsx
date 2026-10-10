import React, { useState } from 'react';
import {
  X,
  Settings,
  PlugZap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Code2,
  HelpCircle,
  FileJson,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { WebhookConfig } from '../../types/resume';
import { ApiService } from '../../services/api';

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WebhookConfig;
  onSave: (config: WebhookConfig) => void;
}

export const WebhookSettingsModal: React.FC<WebhookSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<WebhookConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'prompt' | 'json'>('config');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    statusCode?: number;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await ApiService.testConnection(formData);
      setTestResult(res);
    } catch (e: unknown) {
      setTestResult({
        ok: false,
        message: (e as Error).message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAndClose = () => {
    onSave(formData);
    onClose();
  };

  const sampleN8nPrompt = `You are CareerForge AI, a specialized resume tailoring engine and expert LaTeX typesetter.

TASK:
Tailor the user's master resume LaTeX source code for the specified target job description.

STRICT TRUTHFULNESS & ZERO-HALLUCINATION RULES:
1. NEVER invent employers, job titles, employment dates, responsibilities, projects, achievements, numerical metrics, degrees, or certifications.
2. Adapt bullet points and summary ONLY by rephrasing, clarifying, and prioritizing experiences that are genuinely present in the master resume.
3. If the job description requires skills/technologies that the master resume does not have, list them honestly in "missingRequirements" as gaps. NEVER add fake skills to the LaTeX code.

LATEX COMPILATION INTEGRITY RULES:
1. Preserve the master resume's documentclass, packages, custom commands, macros, section headers, spacing, and styling verbatim.
2. Generate ONE complete, self-contained, compilable LaTeX document starting with \\documentclass and ending with \\end{document}.
3. Properly escape all special characters: use \\%, \\$, \\&, \\_, \\# in text context.
4. Ensure all environments (\\begin{...} and \\end{...}) and braces ({ and }) are strictly balanced.

OUTPUT FORMAT:
Return a single valid JSON object with the following schema:
{
  "tailoredTex": "complete compilable LaTeX string",
  "matchScore": 85,
  "scoreBreakdown": {
    "skillsAlignment": 88,
    "experienceRelevance": 90,
    "keywordOptimization": 80,
    "templateIntegrity": 98
  },
  "summary": "Concise executive alignment summary",
  "matchedRequirements": [
    {
      "id": "mr-1",
      "requirement": "Target requirement description",
      "sourceEvidence": "Exact evidence found in master resume",
      "category": "core_skill",
      "confidence": 0.95
    }
  ],
  "missingRequirements": [
    {
      "id": "miss-1",
      "requirement": "Required tool or language not found in resume",
      "severity": "critical",
      "recommendation": "Tactical recommendation for interview",
      "sourceCheck": "Verified absent from master source"
    }
  ],
  "tailoringRecommendations": [
    {
      "id": "rec-1",
      "area": "Summary / Skills / Experience",
      "suggestion": "Actionable resume advice",
      "reason": "Why this improves alignment"
    }
  ],
  "changesApplied": [
    {
      "id": "ch-1",
      "section": "Experience",
      "changeType": "rephrase",
      "originalSnippet": "Original text snippet",
      "tailoredSnippet": "Tailored text snippet",
      "reasoning": "Why it was adapted"
    }
  ]
}`;

  const sampleN8nWorkflowJson = JSON.stringify(
    {
      name: "CareerForge AI Resume Tailoring Workflow",
      nodes: [
        {
          parameters: {
            httpMethod: "POST",
            path: "careerforge-tailor",
            responseMode: "responseNode",
            options: {
              allowedOrigins: "*",
              responseHeaders: {
                entries: [
                  { name: "Access-Control-Allow-Origin", value: "*" },
                  { name: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" }
                ]
              }
            }
          },
          name: "Webhook",
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [180, 240]
        },
        {
          parameters: {
            jsCode: `// Validate incoming CareerForge AI payload\nconst body = $input.first().json.body || $input.first().json;\nif (!body.masterResumeTex || !body.jobDescription) {\n  throw new Error('masterResumeTex and jobDescription are required');\n}\nreturn [{ json: body }];`
          },
          name: "Validate Input",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [380, 240]
        },
        {
          parameters: {
            model: "claude-3-5-sonnet-20241022",
            promptType: "define",
            text: `={{ $json.masterResumeTex }}\n\nJob Description:\n{{ $json.jobDescription }}\n\nTarget Role: {{ $json.targetRole }}\nTarget Company: {{ $json.targetCompany }}`
          },
          name: "AI Tailoring LLM",
          type: "@n8n/n8n-nodes-langchain.agent",
          typeVersion: 1.6,
          position: [580, 240]
        },
        {
          parameters: {
            respondWith: "json",
            responseBody: "={{ $json.output }}"
          },
          name: "Respond to Webhook",
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1.1,
          position: [800, 240]
        }
      ],
      connections: {
        "Webhook": { "main": [[{ "node": "Validate Input", "type": "main", "index": 0 }]] },
        "Validate Input": { "main": [[{ "node": "AI Tailoring LLM", "type": "main", "index": 0 }]] },
        "AI Tailoring LLM": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] }
      }
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0f172a] border border-[#24324f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-[#1f2d48] flex items-center justify-between bg-[#131b2e]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <PlugZap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">n8n Cloud Webhook Integration</h3>
              <p className="text-xs text-slate-400">
                Connect your automated AI workflow or inspect webhook specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1f2d48] bg-[#0c1322] px-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Webhook Configuration
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup Guide (Step-by-Step)
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'prompt'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI System Prompt
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'json'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            n8n Workflow JSON
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {/* TAB 1: Configuration Form */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              {/* Mode Toggle Box */}
              <div className="p-4 bg-[#131b2e] rounded-xl border border-[#24324f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Execution Mode:
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        formData.isLiveMode && formData.url
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {formData.isLiveMode && formData.url ? 'LIVE N8N ACTIVE' : 'DEMO MODE (Simulation)'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Toggle between local simulation and dispatching requests to your n8n Cloud webhook.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.isLiveMode}
                    onChange={(e) => setFormData({ ...formData, isLiveMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              {/* Webhook URL */}
              <div className="space-y-1.5">
                <label className="block text-slate-200 font-semibold">
                  n8n Cloud Webhook URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://your-workspace.app.n8n.cloud/webhook/careerforge-tailor"
                  className="w-full px-3.5 py-2.5 bg-[#0b101d] border border-[#24324f] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Use the <strong>Production URL</strong> from your n8n Webhook node. Ensure the workflow is activated.
                </p>
              </div>

              {/* Security & Auth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-slate-200 font-medium">Header Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.authHeaderName}
                    onChange={(e) => setFormData({ ...formData, authHeaderName: e.target.value })}
                    placeholder="Authorization or x-api-key"
                    className="w-full px-3 py-2 bg-[#0b101d] border border-[#24324f] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-200 font-medium">Secret / Token (Optional)</label>
                  <input
                    type="password"
                    value={formData.authToken}
                    onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                    placeholder="Bearer token or custom key"
                    className="w-full px-3 py-2 bg-[#0b101d] border border-[#24324f] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Timeout */}
              <div className="space-y-1.5">
                <label className="block text-slate-200 font-medium">Request Timeout (Seconds)</label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={formData.timeoutSeconds}
                  onChange={(e) => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) || 60 })}
                  className="w-32 px-3 py-2 bg-[#0b101d] border border-[#24324f] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-[11px] text-slate-500 ml-2">
                  (Recommended: 60 - 120s for deep LLM synthesis)
                </span>
              </div>

              {/* Test Connection Button & Status */}
              <div className="pt-2 border-t border-[#1f2d48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing || !formData.url}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    testing || !formData.url
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      : 'bg-[#18233b] hover:bg-[#202f50] text-sky-300 border-sky-500/40'
                  }`}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <PlugZap className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>

                {testResult && (
                  <div
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs ${
                      testResult.ok
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                    }`}
                  >
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Secrets disclaimer */}
              <div className="p-3 bg-sky-950/20 border border-sky-800/30 rounded-xl text-[11px] text-sky-300/90 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                <span>
                  <strong>Client Security:</strong> All tokens and URLs are saved strictly in your local
                  browser storage. No external AI keys or sensitive server credentials are embedded in the frontend bundle.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Step-by-Step Setup Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 leading-relaxed">
              <h4 className="text-sm font-bold text-white">How to connect CareerForge AI to n8n Cloud:</h4>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#131b2e] border border-[#24324f] rounded-xl space-y-1">
                  <p className="font-semibold text-sky-400">Step 1: Create an n8n Workflow</p>
                  <p className="text-[11px] text-slate-300">
                    Log into your n8n Cloud or self-hosted instance and create a new workflow.
                  </p>
                </div>

                <div className="p-3.5 bg-[#131b2e] border border-[#24324f] rounded-xl space-y-1">
                  <p className="font-semibold text-sky-400">Step 2: Add Webhook Node</p>
                  <ul className="list-disc pl-5 text-[11px] space-y-1 text-slate-300">
                    <li>Set <strong>HTTP Method</strong> to <code>POST</code>.</li>
                    <li>Set <strong>Path</strong> to <code>careerforge-tailor</code>.</li>
                    <li>Set <strong>Response Mode</strong> to <code>Using 'Respond to Webhook' Node</code>.</li>
                    <li>
                      In <strong>Options</strong>, enable <code>Allowed Origins (CORS)</code> and set to <code>*</code> so browser fetch calls succeed without CORS errors.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#131b2e] border border-[#24324f] rounded-xl space-y-1">
                  <p className="font-semibold text-sky-400">Step 3: Add LLM Model Node</p>
                  <p className="text-[11px] text-slate-300">
                    Connect an AI node (Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, or Gemini 1.5 Pro).
                    Copy the system prompt from the <strong>AI System Prompt</strong> tab to enforce strict zero-hallucination and compilable LaTeX output.
                  </p>
                </div>

                <div className="p-3.5 bg-[#131b2e] border border-[#24324f] rounded-xl space-y-1">
                  <p className="font-semibold text-sky-400">Step 4: Add Respond to Webhook Node</p>
                  <p className="text-[11px] text-slate-300">
                    Set Respond With to <code>JSON</code> and pass the structured output containing <code>tailoredTex</code>, <code>matchScore</code>, <code>matchedRequirements</code>, etc.
                  </p>
                </div>

                <div className="p-3.5 bg-[#131b2e] border border-[#24324f] rounded-xl space-y-1">
                  <p className="font-semibold text-sky-400">Step 5: Activate & Paste URL</p>
                  <p className="text-[11px] text-slate-300">
                    Toggle your n8n workflow to <strong>Active</strong>. Copy the <strong>Production Webhook URL</strong> into the configuration tab here, toggle Live Mode on, and click Save.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: System Prompt */}
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Paste this prompt into your LLM agent in n8n to guarantee compilable LaTeX and zero hallucinations:
                </p>
                <button
                  onClick={() => handleCopy(sampleN8nPrompt, 'prompt')}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium text-xs transition-colors shrink-0"
                >
                  {copiedKey === 'prompt' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-[#090d16] border border-[#24324f] rounded-xl font-mono text-[11px] leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap text-slate-300">
                {sampleN8nPrompt}
              </div>
            </div>
          )}

          {/* TAB 4: Workflow JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Ready-to-import n8n workflow. Copy this JSON, go to n8n canvas, and press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Ctrl+V</kbd> to paste!
                </p>
                <button
                  onClick={() => handleCopy(sampleN8nWorkflowJson, 'workflow')}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium text-xs transition-colors shrink-0"
                >
                  {copiedKey === 'workflow' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Workflow JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-[#090d16] border border-[#24324f] rounded-xl font-mono text-[11px] leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap text-slate-300">
                {sampleN8nWorkflowJson}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#1f2d48] bg-[#131b2e] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
