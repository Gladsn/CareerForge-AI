import { TailoringSession, WebhookConfig, TailoringOptions } from '../types/resume';

const STORAGE_KEY_SESSIONS = 'careerforge_sessions_v1';
const STORAGE_KEY_WEBHOOK = 'careerforge_webhook_config_v1';
const STORAGE_KEY_OPTIONS = 'careerforge_options_v1';

export const defaultWebhookConfig: WebhookConfig = {
  url: '',
  authHeaderName: 'Authorization',
  authToken: '',
  timeoutSeconds: 300, // 300 seconds (5 minutes)
  isLiveMode: true,
  testStatus: 'idle',
};

export const defaultTailoringOptions: TailoringOptions = {
  tone: 'technical',
  strictAntiHallucination: true,
  prioritizeKeywords: true,
};

export const StorageService = {
  getSessions(): TailoringSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load sessions from localStorage', e);
      return [];
    }
  },

  saveSession(session: TailoringSession): void {
    try {
      const existing = this.getSessions();
      // Keep up to 25 latest sessions
      const updated = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, 25);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  },

  deleteSession(id: string): void {
    try {
      const existing = this.getSessions();
      const updated = existing.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete session', e);
    }
  },

  clearSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSIONS);
    } catch (e) {
      console.error('Failed to clear sessions', e);
    }
  },

  getWebhookConfig(): WebhookConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_WEBHOOK);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...defaultWebhookConfig,
          ...parsed,
          timeoutSeconds: Math.max(parsed.timeoutSeconds || 0, 300),
        };
      }
      return defaultWebhookConfig;
    } catch (e) {
      console.error('Failed to load webhook config', e);
      return defaultWebhookConfig;
    }
  },

  saveWebhookConfig(config: WebhookConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_WEBHOOK, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save webhook config', e);
    }
  },

  getOptions(): TailoringOptions {
    try {
      const data = localStorage.getItem(STORAGE_KEY_OPTIONS);
      return data ? { ...defaultTailoringOptions, ...JSON.parse(data) } : defaultTailoringOptions;
    } catch (e) {
      return defaultTailoringOptions;
    }
  },

  saveOptions(options: TailoringOptions): void {
    try {
      localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
    } catch (e) {
      console.error('Failed to save options', e);
    }
  },
};
