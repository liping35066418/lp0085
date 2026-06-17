import type { ModuleInfo, ModuleType, TemplateType } from '../types';
import { getTemplate } from '../templates';

const MODULE_NAMES: Record<ModuleType, string> = {
  introduction: '绪论',
  experiment: '实验',
  data: '数据',
  conclusion: '结论',
};

const MODULE_ORDER: ModuleType[] = ['introduction', 'experiment', 'data', 'conclusion'];

const countWords = (text: string): number => {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
};

const findKeywordPositions = (
  text: string,
  keywords: string[],
): number[] => {
  const positions: number[] = [];
  keywords.forEach((keyword) => {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }
  });
  return [...new Set(positions)].sort((a, b) => a - b);
};

export const detectModules = (
  text: string,
  templateType: TemplateType,
): ModuleInfo[] => {
  const template = getTemplate(templateType);
  const modules: ModuleInfo[] = [];
  const modulePositions: Record<ModuleType, number[]> = {
    introduction: [],
    experiment: [],
    data: [],
    conclusion: [],
  };

  MODULE_ORDER.forEach((type) => {
    modulePositions[type] = findKeywordPositions(
      text,
      template.moduleRequirements[type].keywords,
    );
  });

  const boundaryMap: { pos: number; type: ModuleType }[] = [];
  MODULE_ORDER.forEach((type) => {
    if (modulePositions[type].length > 0) {
      boundaryMap.push({ pos: modulePositions[type][0], type });
    }
  });

  boundaryMap.sort((a, b) => a.pos - b.pos);

  const firstContent = text.search(/\S/);
  if (boundaryMap.length === 0 || (boundaryMap[0]?.pos ?? Infinity) > 50) {
    boundaryMap.unshift({ pos: Math.max(0, firstContent), type: 'introduction' });
  }

  for (let i = 0; i < boundaryMap.length; i++) {
    const current = boundaryMap[i];
    const next = boundaryMap[i + 1];
    const startIndex = current.pos;
    const endIndex = next ? next.pos : text.length;
    const moduleText = text.slice(startIndex, endIndex);
    const wordCount = countWords(moduleText);
    const minWords = template.moduleRequirements[current.type].minWords;
    const completeness = Math.min(100, Math.round((wordCount / minWords) * 100));

    modules.push({
      type: current.type,
      name: MODULE_NAMES[current.type],
      startIndex,
      endIndex,
      wordCount,
      completeness,
    });
  }

  const existingTypes = new Set(modules.map((m) => m.type));
  MODULE_ORDER.forEach((type) => {
    if (!existingTypes.has(type)) {
      modules.push({
        type,
        name: MODULE_NAMES[type],
        startIndex: -1,
        endIndex: -1,
        wordCount: 0,
        completeness: 0,
      });
    }
  });

  return modules.sort(
    (a, b) => MODULE_ORDER.indexOf(a.type) - MODULE_ORDER.indexOf(b.type),
  );
};
