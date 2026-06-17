import type { TemplateRule } from '../types';

export const engineeringTemplate: TemplateRule = {
  moduleRequirements: {
    introduction: {
      minWords: 300,
      keywords: ['引言', '绪论', '背景', '研究背景', '研究现状', '文献综述', '研究意义', '研究目的', '研究问题'],
    },
    experiment: {
      minWords: 500,
      keywords: ['实验', '方法', '实验方法', '实验设计', '实验步骤', '实验装置', '仪器', '材料', '试样', '样品制备'],
    },
    data: {
      minWords: 400,
      keywords: ['数据', '结果', '实验结果', '数据分析', '统计', '图表', '表格', '图', '表', '显著性', 'p值', '误差'],
    },
    conclusion: {
      minWords: 200,
      keywords: ['结论', '讨论', '总结', '展望', '研究结论', '讨论与分析'],
    },
  },
  logicFlowRules: [
    '绪论部分应包含研究背景、问题提出、研究目标',
    '实验部分应包含方法描述、变量控制、实验流程',
    '数据部分应包含结果呈现、统计分析、对比讨论',
    '结论部分应包含主要发现、研究局限、未来展望',
  ],
  evidenceRequirements: [
    '实验方法应明确说明变量与控制条件',
    '数据结果应包含具体数值或统计指标',
    '关键论点应有数据或文献支撑',
    '结论应与实验数据形成逻辑对应',
  ],
  suggestions: {
    introduction: [
      { title: '补充研究背景', description: '建议增加当前领域研究现状的文献综述，明确研究空白' },
      { title: '明确研究问题', description: '建议清晰表述本研究要解决的核心科学问题' },
      { title: '阐述研究意义', description: '建议说明本研究的理论价值与实际应用价值' },
    ],
    experiment: [
      { title: '完善实验设计', description: '建议补充实验装置图或流程图，明确自变量与因变量' },
      { title: '说明控制条件', description: '建议明确列出需要控制的干扰变量及控制方法' },
      { title: '描述实验步骤', description: '建议按时间顺序详细描述实验操作流程' },
    ],
    data: [
      { title: '增加数据呈现', description: '建议以图表形式展示核心实验数据' },
      { title: '补充统计分析', description: '建议增加统计显著性检验与误差分析' },
      { title: '对比分析', description: '建议与同类研究或理论预期进行数据对比' },
    ],
    conclusion: [
      { title: '总结主要发现', description: '建议提炼2-3条核心研究结论' },
      { title: '讨论研究局限', description: '建议客观分析本研究方法或数据的局限性' },
      { title: '提出未来展望', description: '建议基于本研究提出后续可深入的研究方向' },
    ],
  },
};
