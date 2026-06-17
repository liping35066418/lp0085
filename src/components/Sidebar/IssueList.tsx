import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Database, Link2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { PriorityBadge } from '../common/PriorityBadge';
import type { LogicGap, EvidenceIssue } from '../../../shared/types';

export const IssueList = () => {
  const { analysisResult, selectedIssueId, setSelectedIssueId } = useEditorStore();
  const [expanded, setExpanded] = useState(true);

  const logicGaps = analysisResult?.logicGaps ?? [];
  const evidenceIssues = analysisResult?.evidenceIssues ?? [];
  const totalIssues = logicGaps.length + evidenceIssues.length;

  const handleItemClick = (id: string) => {
    setSelectedIssueId(selectedIssueId === id ? null : id);
  };

  return (
    <div className="glass-panel animate-slide-in-up" style={{ animationDelay: '100ms' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-gray-200">问题检测</span>
          <span className="tag-chip bg-red-500/15 text-red-400 text-[10px]">
            {totalIssues} 项
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 max-h-80 overflow-y-auto">
          {totalIssues === 0 ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-500">未检测到明显问题</p>
            </div>
          ) : (
            <>
              {logicGaps.map((gap) => (
                <IssueCard
                  key={gap.id}
                  id={gap.id}
                  isSelected={selectedIssueId === gap.id}
                  onClick={() => handleItemClick(gap.id)}
                  data={gap}
                  type="gap"
                />
              ))}
              {evidenceIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  id={issue.id}
                  isSelected={selectedIssueId === issue.id}
                  onClick={() => handleItemClick(issue.id)}
                  data={issue}
                  type="evidence"
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const IssueCard = ({
  id,
  isSelected,
  onClick,
  data,
  type,
}: {
  id: string;
  isSelected: boolean;
  onClick: () => void;
  data: LogicGap | EvidenceIssue;
  type: 'gap' | 'evidence';
}) => {
  const Icon = type === 'gap' ? Link2 : Database;
  const colorClass = type === 'gap' ? 'text-red-400' : 'text-amber-400';
  const bgClass = isSelected
    ? type === 'gap'
      ? 'bg-red-500/10 border-red-500/40'
      : 'bg-amber-500/10 border-amber-500/40'
    : 'bg-surface-dark/50 border-transparent hover:border-white/10';

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${bgClass}`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 flex-shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-200 truncate">
              {type === 'gap' ? '逻辑断层' : '论据问题'}
            </span>
            {'severity' in data ? (
              <PriorityBadge priority={data.severity} label="" />
            ) : (
              <PriorityBadge
                priority={
                  data.type === 'missing_data'
                    ? 'high'
                    : data.type === 'no_citation'
                    ? 'medium'
                    : 'low'
                }
                label=""
              />
            )}
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
            {data.description}
          </p>
          {'suggestion' in data && data.suggestion && isSelected && (
            <p className="text-[11px] text-primary mt-2 pt-2 border-t border-white/5 leading-relaxed">
              💡 {data.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
