export type ToneOption = 'confident' | 'technical' | 'executive';

export interface TailoringOptions {
  tone: ToneOption;
  strictAntiHallucination: boolean;
  prioritizeKeywords: boolean;
}

export interface LatexValidationWarning {
  line?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

export interface LatexStats {
  lineCount: number;
  sectionCount: number;
  commandCount: number;
  documentClass: string;
  braceBalance: number;
  hasBeginDoc: boolean;
  hasEndDoc: boolean;
}

export interface LatexValidationResult {
  isValid: boolean;
  warnings: LatexValidationWarning[];
  stats: LatexStats;
}

export interface MatchedRequirement {
  id: string;
  requirement: string;
  sourceEvidence: string;
  category: 'core_skill' | 'experience' | 'education' | 'tool_framework';
  confidence: number;
}

export interface MissingRequirement {
  id: string;
  requirement: string;
  severity: 'critical' | 'preferred' | 'bonus';
  recommendation: string;
  sourceCheck: string;
}

export interface TailoringRecommendation {
  id: string;
  area: string;
  suggestion: string;
  reason: string;
}

export interface AppliedChange {
  id: string;
  section: string;
  changeType: 'rephrase' | 'reorder' | 'skill_emphasis' | 'summary_tailored';
  originalSnippet: string;
  tailoredSnippet: string;
  reasoning: string;
}

export interface ScoreBreakdown {
  skillsAlignment: number;
  experienceRelevance: number;
  keywordOptimization: number;
  templateIntegrity: number;
}

export interface AnalysisResult {
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  summary: string;
  matchedRequirements: MatchedRequirement[];
  missingRequirements: MissingRequirement[];
  tailoringRecommendations: TailoringRecommendation[];
  changesApplied: AppliedChange[];
  tailoredTex: string;
  latexValidation?: LatexValidationResult;
  modelUsed?: string;
  generatedAt: string;
}

export interface TailoringSession {
  id: string;
  createdAt: string;
  targetRole: string;
  targetCompany: string;
  masterResumeTex: string;
  jobDescription: string;
  result: AnalysisResult;
}

export interface WebhookConfig {
  url: string;
  authHeaderName: string;
  authToken: string;
  timeoutSeconds: number;
  isLiveMode: boolean;
  lastTestedAt?: string;
  testStatus?: 'idle' | 'testing' | 'success' | 'error';
  lastTestMessage?: string;
}

export interface N8nWebhookRequestPayload {
  masterLatex?: string;
  masterResumeTex: string;
  jobDescription: string;
  targetRole: string;
  targetCompany: string;
  options?: TailoringOptions;
  timestamp: string;
}

export interface N8nWebhookResponsePayload {
  tailoredLatex?: string;
  tailoredTex?: string;
  matchScore: number;
  scoreBreakdown?: ScoreBreakdown;
  summary: string;
  matchedRequirements: MatchedRequirement[];
  missingRequirements: MissingRequirement[];
  tailoringRecommendations: TailoringRecommendation[];
  changesApplied: AppliedChange[];
  warnings?: string[];
  modelUsed?: string;
}
