export type ModuleType = 'introduction' | 'experiment' | 'data' | 'conclusion';

export type TemplateType = 'engineering' | 'biology';

export type Severity = 'high' | 'medium' | 'low';

export interface ModuleInfo {
  type: ModuleType;
  name: string;
  startIndex: number;
  endIndex: number;
  wordCount: number;
  completeness: number;
}

export interface LogicGap {
  id: string;
  startIndex: number;
  endIndex: number;
  severity: Severity;
  description: string;
  suggestion: string;
}

export interface EvidenceIssue {
  id: string;
  startIndex: number;
  endIndex: number;
  type: 'missing_data' | 'weak_argument' | 'no_citation';
  description: string;
}

export interface ScoreData {
  overall: number;
  moduleCompleteness: number;
  logicFlow: number;
  evidenceSufficiency: number;
}

export interface Suggestion {
  id: string;
  module: ModuleType;
  priority: Severity;
  title: string;
  description: string;
}

export interface AnalyzeRequest {
  text: string;
  template: TemplateType;
}

export interface AnalyzeResponse {
  modules: ModuleInfo[];
  logicGaps: LogicGap[];
  evidenceIssues: EvidenceIssue[];
  scores: ScoreData;
  suggestions: Suggestion[];
}

export interface TemplateRule {
  moduleRequirements: Record<ModuleType, {
    minWords: number;
    keywords: string[];
  }>;
  logicFlowRules: string[];
  evidenceRequirements: string[];
  suggestions: Record<ModuleType, {
    title: string;
    description: string;
  }[]>;
}
