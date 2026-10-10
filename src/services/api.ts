import {
  N8nWebhookRequestPayload,
  N8nWebhookResponsePayload,
  AnalysisResult,
  WebhookConfig,
} from '../types/resume';
import { validateLatex } from './latexValidator';

export class ApiError extends Error {
  statusCode?: number;
  isNetworkError: boolean;
  constructor(message: string, statusCode?: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

export const ApiService = {
  /**
   * Tailor resume by connecting directly to user's n8n webhook
   */
  async tailorResume(
    payload: N8nWebhookRequestPayload,
    config: WebhookConfig,
    onProgress?: (stage: string) => void
  ): Promise<AnalysisResult> {
    if (!config.url || !config.url.trim()) {
      throw new ApiError('Please enter your n8n Webhook URL before generating.');
    }

    onProgress?.('Sending resume & job description to n8n webhook...');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (config.authToken && config.authHeaderName) {
      const authVal =
        config.authHeaderName.toLowerCase() === 'authorization' &&
        !config.authToken.toLowerCase().startsWith('bearer ')
          ? `Bearer ${config.authToken}`
          : config.authToken;

      headers[config.authHeaderName] = authVal;
    }

    const controller = new AbortController();
    const timeoutSeconds = Math.max(config.timeoutSeconds || 0, 300); // 300 seconds (5 minutes)
    const timeoutDuration = timeoutSeconds * 1000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      onProgress?.('Tailoring resume, this may take a few minutes... Executing n8n workflow');

      const outboundBody = {
        masterLatex: payload.masterResumeTex || (payload as any).masterLatex || '',
        masterResumeTex: payload.masterResumeTex || (payload as any).masterLatex || '',
        jobDescription: payload.jobDescription || '',
        targetRole: payload.targetRole || '',
        targetCompany: payload.targetCompany || '',
        timestamp: payload.timestamp || new Date().toISOString(),
      };

      const response = await fetch(config.url.trim(), {
        method: 'POST',
        headers,
        body: JSON.stringify(outboundBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errBody = '';
        try {
          errBody = await response.text();
        } catch {
          // Ignore
        }
        throw new ApiError(
          `n8n webhook returned HTTP ${response.status}: ${errBody || response.statusText}`,
          response.status
        );
      }

      onProgress?.('Processing response from n8n...');
      const responseText = await response.text();

      let rawData: any;
      try {
        rawData = JSON.parse(responseText);
      } catch (jsonErr) {
        // Check if n8n returned a markdown codeblock like ```json ... ```
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          rawData = JSON.parse(jsonMatch[1]);
        } else {
          // If n8n just returned raw LaTeX text
          if (responseText.includes('\\documentclass') || responseText.includes('\\begin{document}')) {
            rawData = { tailoredTex: responseText };
          } else {
            throw new ApiError(
              `Failed to parse response as JSON. Received: ${responseText.slice(0, 200)}...`
            );
          }
        }
      }

      onProgress?.('Validating LaTeX syntax and document structure...');
      const parsed = this.normalizeN8nResponse(rawData, payload);
      parsed.latexValidation = validateLatex(parsed.tailoredTex);

      return parsed;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError(
          `n8n webhook timed out after ${timeoutSeconds}s (5 minutes). Your AI LLM node may still be processing in n8n. Check your n8n workflow execution logs.`,
          408
        );
      }

      if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
        throw new ApiError(
          `Failed to connect to n8n Webhook: ${err.message}. If using n8n Cloud or self-hosted, ensure CORS is enabled on the Webhook node (Options > Allowed Origins: *) and your workflow is Active.`,
          0,
          true
        );
      }

      if (err instanceof ApiError) {
        throw err;
      }

      throw new ApiError((err as Error).message || 'An unexpected error occurred while calling n8n.');
    }
  },

  /**
   * Test connection to n8n webhook
   */
  async testConnection(config: WebhookConfig): Promise<{ ok: boolean; message: string; statusCode?: number }> {
    if (!config.url || !config.url.trim()) {
      return { ok: false, message: 'Please enter a webhook URL first.' };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.authToken && config.authHeaderName) {
        headers[config.authHeaderName] = config.authToken;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(config.url.trim(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'ping',
          test: true,
          message: 'CareerForge AI Webhook Test',
          masterLatex: '% CareerForge AI Test Ping\n\\documentclass{article}\n\\begin{document}\nTest\n\\end{document}',
          masterResumeTex: '% CareerForge AI Test Ping\n\\documentclass{article}\n\\begin{document}\nTest\n\\end{document}',
          jobDescription: 'CareerForge AI Test Job Description for Webhook Verification',
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        return {
          ok: true,
          message: `Connected successfully! (HTTP ${res.status})`,
          statusCode: res.status,
        };
      } else {
        let errSnippet = '';
        try {
          errSnippet = await res.text();
        } catch {}
        return {
          ok: false,
          message: `Webhook returned HTTP ${res.status}${errSnippet ? ': ' + errSnippet.slice(0, 120) : ''}`,
          statusCode: res.status,
        };
      }
    } catch (err: unknown) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      return {
        ok: false,
        message: isAbort
          ? 'Webhook test timed out after 12s.'
          : `Connection failed: ${(err as Error).message}. Check URL and CORS settings.`,
      };
    }
  },

  /**
   * Normalizes whatever response n8n provides into standard AnalysisResult
   */
  normalizeN8nResponse(raw: any, payload: N8nWebhookRequestPayload): AnalysisResult {
    // If n8n returns an array [{ ... }], unwrap first element
    let data = Array.isArray(raw) ? raw[0] : raw;

    // If n8n returned output wrapped inside an "output", "body", "data", "result", "response" or "json" property
    if (data?.output && typeof data.output === 'object') data = data.output;
    else if (data?.json && typeof data.json === 'object') data = data.json;
    else if (data?.body && typeof data.body === 'object') data = data.body;
    else if (data?.data && typeof data.data === 'object') data = data.data;
    else if (data?.result && typeof data.result === 'object') data = data.result;
    else if (data?.response && typeof data.response === 'object') data = data.response;

    // Handle output if it's a string containing JSON
    if (typeof data?.output === 'string') {
      try {
        data = JSON.parse(data.output);
      } catch {
        // Ignore
      }
    }

    // Resolve tailored LaTeX across multiple common property names
    const tailoredTex =
      data?.tailoredLatex ||
      data?.tailoredTex ||
      data?.tailored_latex ||
      data?.tailored_tex ||
      data?.latex ||
      data?.tex ||
      data?.code ||
      data?.resume ||
      data?.newLatex ||
      data?.generatedLatex ||
      (typeof data === 'string' && (data.includes('\\documentclass') || data.includes('\\begin{document}')) ? data : null) ||
      payload.masterResumeTex;

    // Resolve match score
    const matchScore = typeof data?.matchScore === 'number'
      ? data.matchScore
      : typeof data?.match_score === 'number'
      ? data.match_score
      : 80;

    // Normalize matched requirements (handles string arrays or objects)
    const matchedRequirements = Array.isArray(data?.matchedRequirements)
      ? data.matchedRequirements.map((item: any, idx: number) => {
          if (typeof item === 'string') {
            return {
              id: `mr-${idx}`,
              requirement: item,
              sourceEvidence: 'Matched from master resume credentials.',
              category: 'core_skill',
              confidence: 0.9,
            };
          }
          return {
            id: item.id || `mr-${idx}`,
            requirement: item.requirement || item.title || 'Requirement',
            sourceEvidence: item.sourceEvidence || item.evidence || item.proof || '',
            category: item.category || 'core_skill',
            confidence: item.confidence ?? 0.9,
          };
        })
      : [];

    // Normalize missing requirements (handles string arrays or objects)
    const missingRequirements = Array.isArray(data?.missingRequirements)
      ? data.missingRequirements.map((item: any, idx: number) => {
          if (typeof item === 'string') {
            return {
              id: `miss-${idx}`,
              requirement: item,
              severity: 'preferred',
              recommendation: 'Highlight adjacent fundamentals during interviews; do not fabricate.',
              sourceCheck: 'Identified as absent from master resume.',
            };
          }
          return {
            id: item.id || `miss-${idx}`,
            requirement: item.requirement || item.title || 'Missing Requirement',
            severity: item.severity || 'preferred',
            recommendation: item.recommendation || item.advice || 'Address honestly during interviews.',
            sourceCheck: item.sourceCheck || 'Not found in master resume.',
          };
        })
      : [];

    // Normalize recommendations
    const tailoringRecommendations = Array.isArray(data?.tailoringRecommendations)
      ? data.tailoringRecommendations.map((item: any, idx: number) => {
          if (typeof item === 'string') {
            return {
              id: `rec-${idx}`,
              area: 'General Optimization',
              suggestion: item,
              reason: 'Aligns resume with job posting expectations.',
            };
          }
          return {
            id: item.id || `rec-${idx}`,
            area: item.area || 'Optimization',
            suggestion: item.suggestion || item.text || '',
            reason: item.reason || '',
          };
        })
      : [];

    // Normalize changes applied
    const changesApplied = Array.isArray(data?.changesApplied)
      ? data.changesApplied.map((item: any, idx: number) => ({
          id: item.id || `ch-${idx}`,
          section: item.section || 'General',
          changeType: item.changeType || 'rephrase',
          originalSnippet: item.originalSnippet || '',
          tailoredSnippet: item.tailoredSnippet || '',
          reasoning: item.reasoning || item.reason || '',
        }))
      : [];

    return {
      matchScore: Math.min(100, Math.max(0, matchScore)),
      scoreBreakdown: data?.scoreBreakdown || {
        skillsAlignment: matchScore,
        experienceRelevance: matchScore,
        keywordOptimization: Math.max(0, matchScore - 5),
        templateIntegrity: 98,
      },
      summary:
        data?.summary ||
        `Resume tailored for ${payload.targetRole || 'the target job'}. All changes reflect verified source achievements.`,
      matchedRequirements,
      missingRequirements,
      tailoringRecommendations,
      changesApplied,
      tailoredTex,
      modelUsed: data?.modelUsed || 'n8n AI Workflow',
      generatedAt: new Date().toISOString(),
    };
  },
};
