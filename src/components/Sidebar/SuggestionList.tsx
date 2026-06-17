import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { PriorityBadge } from '../common/PriorityBadge';
import { ModuleTag } from '../common/ModuleTag';
import type { Suggestion } from '../../../shared/types';

export const SuggestionList = () => {
  const { analysisResult, text, setText } = useEditorStore();
  const [expanded, setExpanded] = useState(true);

  const suggestions = analysisResult?.suggestions ?? [];

  const applySuggestion = (sug: Suggestion) => {
    const moduleName: Record<string, string> = {
      introduction: '绪论',
      experiment: '实验方法',
      data: '实验结果与数据分析',
      conclusion: '结论与展望',
    };

    const moduleHeader = `\n\n${
      text.includes(moduleName[sug.module]) ? '' : `\n\n### ${moduleName[sug.module]}\n\n`
    }`;
    const suggestionText = `【建议】${sug.title}：${sug.description}`;

    if (!text.includes(moduleName[sug.module])) {
      setText(text + moduleHeader + suggestionText + '\n');
    } else {
      const lines = text.split('\n');
      const targetLine = lines.findIndex((l) => l.includes(moduleName[sug.module]));
      if (targetLine !== -1) {
        lines.splice(targetLine + 1, 0, suggestionText);
        setText(lines.join('\n'));
      } else {
        setText(text + '\n' + suggestionText);
      }
    }
  };

  return (
    <div className="glass-panel animate-slide-in-up" style={{ animationDelay: '200ms' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-gray-200">框架增补建议</span>
          <span className="tag-chip bg-primary/15 text-primary text-[10px]">
            {suggestions.length} 条
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-gray-500">暂无建议</p>
            </div>
          ) : (
            suggestions.map((sug, idx) => (
              <SuggestionCard
                key={sug.id}
                suggestion={sug}
                index={idx}
                onApply={() => applySuggestion(sug)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SuggestionCard = ({
  suggestion,
  index,
  onApply,
}: {
  suggestion: Suggestion;
  index: number;
  onApply: () => void;
}) => {
  return (
    <div
      className="p-3 rounded-lg bg-surface-dark/50 border border-transparent hover:border-primary/30 hover:bg-surface-dark/80 transition-all duration-200 animate-slide-in-up"
      style={{ animationDelay: `${300 + index * 50}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ModuleTag type={suggestion.module} />
            <PriorityBadge priority={suggestion.priority} label="" />
          </div>
          <h4 className="text-xs font-semibold text-gray-200 mb-1">
            {suggestion.title}
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {suggestion.description}
          </p>
          <button
            onClick={onApply}
            className="mt-2.5 flex items-center gap-1 text-[10px] text-primary hover:text-primary-200 transition-colors font-medium"
          >
            <span>插入建议</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
