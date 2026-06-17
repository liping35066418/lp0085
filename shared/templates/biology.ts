import type { TemplateRule } from '../types';

export const biologyTemplate: TemplateRule = {
  moduleRequirements: {
    introduction: {
      minWords: 350,
      keywords: ['引言', '绪论', '背景', '研究背景', '研究现状', '文献综述', '研究意义', '研究目的', '研究问题'],
    },
    experiment: {
      minWords: 600,
      keywords: ['材料', '方法', '材料与方法', '实验材料', '实验方法', '试剂', '仪器', '细胞', '动物', '培养', '提取', '扩增', '测序', '染色', '抗体'],
    },
    data: {
      minWords: 450,
      keywords: ['结果', '实验结果', '数据', '数据分析', '统计', '图表', '显著性', 'p值', '表达', '差异', '阳性', '阴性', '条带'],
    },
    conclusion: {
      minWords: 250,
      keywords: ['结论', '讨论', '总结', '展望', '研究结论', '机制', '讨论与分析'],
    },
  },
  logicFlowRules: [
    '绪论部分应包含研究背景、生物学问题、研究目标',
    '材料与方法应包含生物材料、试剂仪器、实验方法',
    '结果部分应包含实验结果、统计分析、生物学发现',
    '讨论部分应包含机制解释、研究局限、未来展望',
  ],
  evidenceRequirements: [
    '材料与方法应明确生物材料来源与处理方法',
    '实验应包含生物学重复与技术重复说明',
    '关键结果应有统计显著性分析',
    '结论应与实验结果形成生物学机制解释',
  ],
  suggestions: {
    introduction: [
      { title: '补充研究背景', description: '建议增加该生物学问题的研究进展与最新文献综述' },
      { title: '明确科学假说', description: '建议清晰表述本研究要验证的生物学假说' },
      { title: '阐述研究意义', description: '建议说明本研究在基础研究或临床应用上的意义' },
    ],
    experiment: [
      { title: '补充材料信息', description: '建议明确生物材料来源、品系、批号及伦理审批信息' },
      { title: '说明试剂仪器', description: '建议列出关键试剂与仪器的品牌、型号、规格' },
      { title: '详细实验方法', description: '建议详细描述实验操作流程，包括孵育时间、温度、浓度等参数' },
    ],
    data: [
      { title: '增加生物学重复', description: '建议说明独立重复实验次数（n值）及统计方法' },
      { title: '补充统计分析', description: '建议增加统计检验方法与显著性标注' },
      { title: '量化结果呈现', description: '建议以柱状图或折线图展示定量数据，以图片展示定性结果' },
    ],
    conclusion: [
      { title: '机制解释', description: '建议基于实验结果提出可能的生物学机制解释' },
      { title: '与文献对比', description: '建议将本研究发现与已发表研究进行对比讨论' },
      { title: '研究局限与展望', description: '建议说明本研究的技术局限及后续深入研究方向' },
    ],
  },
};
