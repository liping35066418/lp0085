import { useEditorStore } from '../../store/useEditorStore';
import { ModuleTag } from '../common/ModuleTag';
import type { ModuleType } from '../../../shared/types';

const MODULE_ORDER: ModuleType[] = ['introduction', 'experiment', 'data', 'conclusion'];

export const ModuleBar = () => {
  const { analysisResult, text } = useEditorStore();
  const textareaRef = document.querySelector('textarea');

  const scrollToModule = (startIndex: number) => {
    if (!textareaRef || startIndex < 0) return;
    const lines = text.slice(0, startIndex).split('\n').length;
    const lineHeight = 28;
    textareaRef.scrollTop = (lines - 1) * lineHeight - 20;
    textareaRef.focus();
    textareaRef.setSelectionRange(startIndex, startIndex);
  };

  const modules = analysisResult?.modules ?? [];

  return (
    <div className="px-5 py-3 border-b border-white/5 bg-surface-dark/40 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 mr-2">
        模块识别
      </span>
      {MODULE_ORDER.map((type) => {
        const module = modules.find((m) => m.type === type);
        const hasModule = module && module.startIndex >= 0;
        return (
          <ModuleTag
            key={type}
            type={type}
            wordCount={module?.wordCount}
            onClick={hasModule ? () => scrollToModule(module!.startIndex) : undefined}
            active={false}
          />
        );
      })}
      {!analysisResult && (
        <span className="text-[10px] text-gray-600 ml-2 italic">正在分析...</span>
      )}
    </div>
  );
};
