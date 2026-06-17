import type {
  ScoreData,
  ModuleInfo,
  LogicGap,
  EvidenceIssue,
  Suggestion,
  TemplateType,
  ModuleType,
  Severity,
} from '../types';
import { getTemplate } from '../templates';

const severityWeight: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const getSeverityScore = (items: { severity?: Severity }[], maxPenalty: number): number => {
  if (items.length === 0) return maxPenalty;
  const totalWeight = items.reduce((sum, item) => {
    const s = item.severity ?? 'medium';
    return sum + severityWeight[s];
  }, 0);
  const penalty = Math.min(maxPenalty, totalWeight * 3);
  return Math.max(0, maxPenalty - penalty);
};

export const calculateScores = (
  modules: ModuleInfo[],
  logicGaps: LogicGap[],
  evidenceIssues: EvidenceIssue[],
): ScoreData => {
  const moduleCompleteness = Math.round(
    modules.reduce((sum, m) => sum + m.completeness, 0) / modules.length,
  );

  const logicFlow = getSeverityScore(logicGaps, 100);

  const evidenceSufficiency = getSeverityScore(
    evidenceIssues.map((e) => ({
      severity: e.type === 'missing_data' ? 'high' : e.type === 'no_citation' ? 'medium' : 'low',
    })),
    100,
  );

  const overall = Math.round(
    moduleCompleteness * 0.35 + logicFlow * 0.35 + evidenceSufficiency * 0.30,
  );

  return {
    overall,
    moduleCompleteness,
    logicFlow,
    evidenceSufficiency,
  };
};

export const generateSuggestions = (
  modules: ModuleInfo[],
  logicGaps: LogicGap[],
  evidenceIssues: EvidenceIssue[],
  templateType: TemplateType,
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const template = getTemplate(templateType);
  let idCounter = 0;

  const MODULE_ORDER: ModuleType[] = ['introduction', 'experiment', 'data', 'conclusion'];

  MODULE_ORDER.forEach((type) => {
    const module = modules.find((m) => m.type === type);
    if (!module || module.completeness < 60) {
      const count = module ? (module.completeness < 30 ? 3 : module.completeness < 50 ? 2 : 1) : 3;
      template.suggestions[type].slice(0, count).forEach((s) => {
        suggestions.push({
          id: `sug-${idCounter++}`,
          module: type,
          priority: count >= 3 ? 'high' : count === 2 ? 'medium' : 'low',
          title: s.title,
          description: s.description,
        });
      });
    }
  });

  if (logicGaps.some((g) => g.severity === 'high')) {
    suggestions.push({
      id: `sug-${idCounter++}`,
      module: modules.find((m) => m.startIndex >= 0)?.type ?? 'introduction',
      priority: 'high',
      title: '加强逻辑衔接',
      description: '部分段落之间逻辑衔接不足，建议使用过渡词并确保前后论证的连贯性',
    });
  }

  if (evidenceIssues.some((e) => e.type === 'missing_data')) {
    suggestions.push({
      id: `sug-${idCounter++}`,
      module: 'experiment',
      priority: 'high',
      title: '补充实验数据',
      description: '实验部分缺少关键参数或定量数据，建议补充数值描述与实验条件',
    });
  }

  if (evidenceIssues.some((e) => e.type === 'no_citation')) {
    suggestions.push({
      id: `sug-${idCounter++}`,
      module: 'introduction',
      priority: 'medium',
      title: '增加文献引用',
      description: '建议在绪论和讨论部分补充相关研究文献的引用，增强学术性',
    });
  }

  return suggestions.sort((a, b) => severityWeight[b.priority] - severityWeight[a.priority]);
};
