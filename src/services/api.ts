import type {
  AnalyzeRequest, AnalyzeResponse, TemplateType, TemplateRule } from '../../shared/types';

const API_BASE = '/api';

const delay = <T>(data: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const analyzeText = async (
  text: string, template: TemplateType): Promise<AnalyzeResponse> => {
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, template } satisfies AnalyzeRequest),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }

    return response.json();
  } catch {
    const { detectModules, detectLogicGaps, detectEvidenceIssues, calculateScores, generateSuggestions } = await import('../utils/analysisFallback');
    const modules = detectModules(text, template);
    const logicGaps = detectLogicGaps(text, modules, template);
    const evidenceIssues = detectEvidenceIssues(text, modules);
    const scores = calculateScores(modules, logicGaps, evidenceIssues);
    const suggestions = generateSuggestions(modules, logicGaps, evidenceIssues, template);
    return delay({ modules, logicGaps, evidenceIssues, scores, suggestions });
  }
};

export const getTemplateRule = async (type: TemplateType): Promise<TemplateRule> => {
  try {
    const response = await fetch(`${API_BASE}/templates/${type}`);
    if (!response.ok) throw new Error('Failed to load template');
    return response.json();
  } catch {
    const { getTemplate } = await import('../utils/analysisFallback');
    return delay(getTemplate(type));
  }
};

export const checkHealth = async (): Promise<{ status: string; port: number }> => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  } catch {
    return Promise.resolve({ status: 'offline', port: 8835 });
  }
};
