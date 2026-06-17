import { FileText, Trash2, Type, Beaker } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import type { TemplateType } from '../../../shared/types';

const SAMPLE_TEXT = `1. 绪论

随着人工智能技术的飞速发展，机器学习在各个领域的应用日益广泛。深度学习模型在图像识别、自然语言处理等任务中取得了突破性进展。然而，在实际工业应用中，模型的泛化能力和鲁棒性仍然面临巨大挑战。

本文针对深度学习模型在小样本场景下的泛化问题展开研究，旨在探索一种新的数据增强方法，提升模型在有限数据条件下的性能表现。

2. 实验方法

本实验采用对比研究设计。实验环境配置如下：处理器为Intel Xeon Gold，内存128GB，GPU为NVIDIA A100（40GB显存）。软件环境采用Python 3.9，PyTorch 1.12框架。

数据集采用公开基准数据集CIFAR-10和mini-ImageNet。每个类别随机抽取5个样本作为训练集（5-way 5-shot设置），测试集每类保留100个样本。

实验分为三组：A组使用传统数据增强（随机裁剪、翻转），B组使用本文提出的增强方法，C组不使用数据增强作为基线。每组实验独立重复5次，记录平均分类准确率和标准差。

3. 实验结果

在CIFAR-10数据集上，A组的平均准确率为68.3%±2.1%，B组达到79.5%±1.8%，C组仅为52.1%±3.2%。B组相对于A组提升了11.2个百分点。

在mini-ImageNet数据集上，B组同样表现最优，准确率为63.2%±2.4%，显著优于A组的54.7%±2.8%。统计检验显示p<0.05，差异具有统计学意义。

4. 结论与展望

实验结果表明，本文提出的数据增强方法在小样本学习场景下能够有效提升模型的泛化能力。该方法通过生成语义一致的合成样本，缓解了训练数据不足导致的过拟合问题。

本研究的局限性在于仅在图像分类任务上进行了验证，未来工作将进一步探索该方法在目标检测、语义分割等更复杂视觉任务中的适用性。此外，如何将增强策略与模型架构设计相结合也是值得深入研究的方向。
`;

export const TopToolbar = () => {
  const { text, template, setTemplate, setText, clearAll } = useEditorStore();

  const charCount = text.length;
  const wordCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length +
    (text.match(/[a-zA-Z]+/g) || []).length;

  const handleTemplateChange = (t: TemplateType) => {
    setTemplate(t);
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-white/5">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/30 to-primary-500/30 flex items-center justify-center border border-primary/30">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold gradient-text leading-tight">
              论文逻辑分析平台
            </h1>
            <p className="text-[10px] text-gray-500 tracking-wide">Paper Logic Analyzer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-elevated rounded-lg border border-white/5">
            <Type className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">
              {charCount} 字符 / {wordCount} 词
            </span>
          </div>

          <div className="flex items-center bg-surface-elevated rounded-lg border border-white/5 p-1">
            <button
              onClick={() => handleTemplateChange('engineering')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                template === 'engineering'
                  ? 'bg-gradient-to-br from-primary/90 to-primary-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              理工类
            </button>
            <button
              onClick={() => handleTemplateChange('biology')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                template === 'biology'
                  ? 'bg-gradient-to-br from-primary/90 to-primary-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              生物类
            </button>
          </div>

          <button
            onClick={loadSample}
            className="btn-secondary text-xs py-1.5 px-3"
            title="加载示例文本"
          >
            示例
          </button>

          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium border border-white/5 hover:border-red-500/30 transition-all duration-200"
            title="清空所有内容"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
        </div>
      </div>
    </header>
  );
};
