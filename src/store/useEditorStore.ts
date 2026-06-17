import { create } from 'zustand';
import type {
  TemplateType,
  AnalyzeResponse,
  ScoreData,
  ModuleInfo,
  LogicGap,
  EvidenceIssue,
  Suggestion,
  Severity,
} from '../../shared/types';

const DEFAULT_TEXT = `1. 引言

随着科学技术的不断发展，本研究领域面临着新的挑战和机遇。本文旨在探讨相关问题并提出解决方案。

2. 实验方法

本实验采用了标准的实验流程。首先准备了实验材料，然后进行了相应的测试。实验过程中记录了相关数据。

3. 实验结果

通过实验，我们得到了一些结果。这些结果表明了某种趋势。

4. 结论

综上所述，本研究取得了一定的成果。未来还需要进一步深入研究。
`;

type SeverityFilter = Severity | 'all';

interface EditorState {
  text: string;
  template: TemplateType;
  analysisResult: AnalyzeResponse | null;
  isAnalyzing: boolean;
  selectedIssueId: string | null;
  selectedSeverity: SeverityFilter;
  setText: (text: string) => void;
  setTemplate: (template: TemplateType) => void;
  setAnalysisResult: (result: AnalyzeResponse | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setSelectedIssueId: (id: string | null) => void;
  setSelectedSeverity: (severity: SeverityFilter) => void;
  clearAll: () => void;
}

const emptyAnalysis: AnalyzeResponse = {
  modules: [],
  logicGaps: [],
  evidenceIssues: [],
  scores: { overall: 0, moduleCompleteness: 0, logicFlow: 0, evidenceSufficiency: 0 },
  suggestions: [],
};

export const useEditorStore = create<EditorState>((set) => ({
  text: DEFAULT_TEXT,
  template: 'engineering',
  analysisResult: null,
  isAnalyzing: false,
  selectedIssueId: null,
  selectedSeverity: 'all',
  setText: (text) => set({ text }),
  setTemplate: (template) => set({ template }),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setSelectedIssueId: (selectedIssueId) => set({ selectedIssueId }),
  setSelectedSeverity: (selectedSeverity) => set({ selectedSeverity }),
  clearAll: () => set({ text: '', analysisResult: null }),
}));

export { emptyAnalysis };
export type { ScoreData, ModuleInfo, LogicGap, EvidenceIssue, Suggestion };
