import type { LogicGap, EvidenceIssue, TemplateType, ModuleInfo } from '../types';
import { getTemplate } from '../templates';

const TRANSITION_WORDS = [
  '因此', '所以', '然而', '但是', '不过', '此外', '另外', '同时', '综上所述',
  '由此可见', '据此', '因此可以', '进而', '从而', '反之', '相比之下', '与此同时',
  '值得注意的是', '需要指出的是', '更为重要的是', '具体来说', '举例来说', '例如',
];

const ARGUMENT_INDICATORS = [
  '数据表明', '结果显示', '统计发现', '实验证明', '研究表明', '文献报道',
  '如图所示', '如表所示', 'p<', '显著性', '差异显著', '具有统计学意义',
];

const CITATION_PATTERNS = [
  /\[\d+\]/, /\(\d{4}\)/, /等[，,].*研究/, /等人/, /et al/,
];

const splitParagraphs = (text: string): { text: string; startIndex: number; endIndex: number }[] => {
  const paragraphs: { text: string; startIndex: number; endIndex: number }[] = [];
  const lines = text.split(/\n\n+/);
  let offset = 0;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      const start = text.indexOf(trimmed, offset);
      if (start !== -1) {
        paragraphs.push({
          text: trimmed,
          startIndex: start,
          endIndex: start + trimmed.length,
        });
        offset = start + trimmed.length;
      }
    }
  });
  return paragraphs;
};

export const detectLogicGaps = (
  text: string,
  modules: ModuleInfo[],
  templateType: TemplateType,
): LogicGap[] => {
  const gaps: LogicGap[] = [];
  const paragraphs = splitParagraphs(text);
  const template = getTemplate(templateType);
  let idCounter = 0;

  for (let i = 0; i < paragraphs.length - 1; i++) {
    const current = paragraphs[i];
    const next = paragraphs[i + 1];
    const hasTransition = TRANSITION_WORDS.some((w) => next.text.includes(w));

    if (!hasTransition && current.text.length > 30 && next.text.length > 30) {
      const commonChars = [...new Set(current.text)].filter((c) =>
        next.text.includes(c),
      ).length;
      const similarity = commonChars / Math.min(current.text.length, next.text.length);

      if (similarity < 0.15) {
        gaps.push({
          id: `gap-${idCounter++}`,
          startIndex: current.endIndex,
          endIndex: next.startIndex,
          severity: similarity < 0.08 ? 'high' : 'medium',
          description: '前后段落语义关联较弱，可能存在逻辑断层',
          suggestion: '建议添加过渡句或衔接词（如"因此""然而""此外"等），明确段落间的逻辑关系',
        });
      }
    }
  }

  modules.forEach((module) => {
    if (module.completeness === 0) {
      const insertPos = Math.min(
        text.length,
        modules.find((m) => m.startIndex > 0)?.startIndex ?? text.length,
      );
      gaps.push({
        id: `gap-${idCounter++}`,
        startIndex: insertPos,
        endIndex: insertPos,
        severity: 'high',
        description: `缺少「${module.name}」模块`,
        suggestion: template.suggestions[module.type][0]?.description ?? `建议补充${module.name}部分内容`,
      });
    }
  });

  return gaps;
};

export const detectEvidenceIssues = (
  text: string,
  modules: ModuleInfo[],
): EvidenceIssue[] => {
  const issues: EvidenceIssue[] = [];
  const paragraphs = splitParagraphs(text);
  let idCounter = 0;

  const experimentModule = modules.find((m) => m.type === 'experiment');
  const dataModule = modules.find((m) => m.type === 'data');

  if (experimentModule && experimentModule.startIndex >= 0) {
    const expText = text.slice(experimentModule.startIndex, experimentModule.endIndex);
    const hasNumbers = /\d/.test(expText);
    const hasConditions = /温度|浓度|时间|压力|pH|转速|剂量/.test(expText);
    if (!hasNumbers || !hasConditions) {
      issues.push({
        id: `evi-${idCounter++}`,
        startIndex: experimentModule.startIndex,
        endIndex: experimentModule.endIndex,
        type: 'missing_data',
        description: '实验部分缺少关键参数（温度、浓度、时间等）或数值描述',
      });
    }
  }

  if (dataModule && dataModule.startIndex >= 0) {
    const dataText = text.slice(dataModule.startIndex, dataModule.endIndex);
    const hasArgument = ARGUMENT_INDICATORS.some((w) => dataText.includes(w));
    if (!hasArgument && dataText.length > 100) {
      issues.push({
        id: `evi-${idCounter++}`,
        startIndex: dataModule.startIndex,
        endIndex: dataModule.endIndex,
        type: 'weak_argument',
        description: '数据部分论证较弱，缺少"数据表明""结果显示"等论断支撑',
      });
    }
  }

  let hasCitation = false;
  CITATION_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      hasCitation = true;
    }
  });

  if (!hasCitation && text.length > 500) {
    const introModule = modules.find((m) => m.type === 'introduction');
    const pos = introModule && introModule.startIndex >= 0
      ? introModule.startIndex
      : 0;
    issues.push({
      id: `evi-${idCounter++}`,
      startIndex: pos,
      endIndex: pos + 1,
      type: 'no_citation',
      description: '全文未发现文献引用标记，建议补充相关研究引用',
    });
  }

  paragraphs.forEach((p) => {
    if (p.text.length > 80) {
      const hasNumbers = /\d/.test(p.text);
      const hasCite = CITATION_PATTERNS.some((pattern) => pattern.test(p.text));
      const hasArg = ARGUMENT_INDICATORS.some((w) => p.text.includes(w));
      if (!hasNumbers && !hasCite && !hasArg && /应该|必须|需要|重要|关键/.test(p.text)) {
        issues.push({
          id: `evi-${idCounter++}`,
          startIndex: p.startIndex,
          endIndex: p.endIndex,
          type: 'weak_argument',
          description: '该段落提出了论断但未提供数据或文献支撑',
        });
      }
    }
  });

  return issues;
};
