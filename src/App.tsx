import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { ConnectionBar } from './components/ConnectionBar';
import { ResumeInputPanel } from './components/ResumeInput/ResumeInputPanel';
import { JobDescriptionPanel } from './components/JobDescription/JobDescriptionPanel';
import { TailoringControls } from './components/Controls/TailoringControls';
import { ResultsDashboard } from './components/Results/ResultsDashboard';
import { LatexEditorPanel } from './components/Editor/LatexEditorPanel';
import { HistoryDrawer } from './components/History/HistoryDrawer';

import {
  AnalysisResult,
  TailoringSession,
  WebhookConfig,
  TailoringOptions,
  N8nWebhookRequestPayload,
} from './types/resume';
import { StorageService } from './services/storage';
import { ApiService, ApiError } from './services/api';

export function App() {
  // Master input state
  const [masterResumeTex, setMasterResumeTex] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  // Webhook config & sessions
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(StorageService.getWebhookConfig());
  const [sessions, setSessions] = useState<TailoringSession[]>(StorageService.getSessions());

  // Result & Editor state
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tailoredTex, setTailoredTex] = useState<string>('');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Tailoring, this takes 1–2 minutes... Executing n8n workflow');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleUpdateWebhookConfig = (newConfig: WebhookConfig) => {
    setWebhookConfig(newConfig);
    StorageService.saveWebhookConfig(newConfig);
  };

  const handleRestoreSession = (session: TailoringSession) => {
    setMasterResumeTex(session.masterResumeTex);
    setJobDescription(session.jobDescription);
    setResult(session.result);
    setTailoredTex(session.result.tailoredTex);
    setErrorMessage(null);
  };

  const handleDeleteSession = (id: string) => {
    StorageService.deleteSession(id);
    setSessions(StorageService.getSessions());
  };

  const handleClearAllSessions = () => {
    StorageService.clearSessions();
    setSessions([]);
  };

  const handleGenerate = async () => {
    if (!masterResumeTex.trim() || !jobDescription.trim()) return;
    if (!webhookConfig.url || !webhookConfig.url.trim()) {
      setErrorMessage('Please enter your n8n Webhook URL above.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const defaultOptions: TailoringOptions = {
      tone: 'technical',
      strictAntiHallucination: true,
      prioritizeKeywords: true,
    };

    const payload: N8nWebhookRequestPayload = {
      masterLatex: masterResumeTex,
      masterResumeTex,
      jobDescription,
      targetRole: '',
      targetCompany: '',
      options: defaultOptions,
      timestamp: new Date().toISOString(),
    };

    try {
      const generatedResult = await ApiService.tailorResume(
        payload,
        webhookConfig,
        (stage) => setLoadingStage(stage)
      );

      setResult(generatedResult);
      setTailoredTex(generatedResult.tailoredTex);

      // Save to sessions history
      const newSession: TailoringSession = {
        id: `sess-${Date.now()}`,
        createdAt: new Date().toISOString(),
        targetRole: 'Tailored Resume',
        targetCompany: '',
        masterResumeTex,
        jobDescription,
        result: generatedResult,
      };

      StorageService.saveSession(newSession);
      setSessions(StorageService.getSessions());

      // Scroll smoothly to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: unknown) {
      console.error('Tailoring error:', err);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage((err as Error).message || 'Failed to connect to n8n webhook.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTailoredTex = (newTex: string) => {
    setTailoredTex(newTex);
    if (result) {
      setResult({
        ...result,
        tailoredTex: newTex,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white">
      {/* Header */}
      <Header
        webhookConfig={webhookConfig}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={sessions.length}
      />

      {/* Prominent n8n Connection Bar */}
      <ConnectionBar
        config={webhookConfig}
        onUpdateConfig={handleUpdateWebhookConfig}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start space-x-3 shadow-lg animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm text-rose-300">Connection or Workflow Notice</p>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section 1 & 2: Inputs Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <ResumeInputPanel
            latexCode={masterResumeTex}
            onChange={setMasterResumeTex}
          />

          <JobDescriptionPanel
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
          />
        </section>

        {/* Section 3: Generate Controls */}
        <section>
          <TailoringControls
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStage={loadingStage}
            hasResume={!!masterResumeTex.trim()}
            hasJobDescription={!!jobDescription.trim()}
            webhookConfig={webhookConfig}
          />
        </section>

        {/* Section 4: Results Dashboard (When generated) */}
        {result && (
          <section id="results-section" className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 text-neutral-300">
              <span className="w-6 h-6 rounded-md bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
                3
              </span>
              <h2 className="text-base font-bold text-white">Results & Match Analysis</h2>
            </div>
            <ResultsDashboard result={result} />
          </section>
        )}

        {/* Section 5: LaTeX Editor & Export */}
        {result && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 text-neutral-300">
              <span className="w-6 h-6 rounded-md bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
                4
              </span>
              <h2 className="text-base font-bold text-white">Tailored LaTeX Code & Export</h2>
            </div>
            <LatexEditorPanel
              tailoredTex={tailoredTex}
              masterTex={masterResumeTex}
              onUpdateTailoredTex={handleUpdateTailoredTex}
            />
          </section>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#1f1f1f] bg-black py-5 text-xs text-neutral-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>CareerForge AI — Connected to n8n Cloud Webhook</span>
          <div className="flex items-center space-x-4">
            <span>Compilable LaTeX</span>
            <span>Overleaf Ready</span>
            <span>Zero-Hallucination Policy</span>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        onRestoreSession={handleRestoreSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
      />
    </div>
  );
}

export default App;
