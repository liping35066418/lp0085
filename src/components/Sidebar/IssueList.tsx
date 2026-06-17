import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Database, Link2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { PriorityBadge } from '../common/PriorityBadge';
import { getIssueSeverity, countBySeverity, filterIssuesBySeverity } from '../../../shared/utils/severity';
import type { LogicGap, EvidenceIssue, Severity } from '../../../shared/types';

const FILTER_TABS: Array<{ key: Severity | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'high', label: '高' },
  { key: 'medium', label: '中' },
  { key: 'low', label: '低' },
];

export const IssueList = () => {
  const {
    analysisResult,
    selectedIssueId,
    setSelectedIssueId,
    selectedSeverity,
    setSelectedSeverity,
  } = useEditorStore();
  const [expanded, setExpanded] = useState(true);

  const logicGaps = analysisResult?.logicGaps ?? [];
  const evidenceIssues = analysisResult?.evidenceIssues ?? [];

  const severityCounts = useMemo(
    () => countBySeverity(logicGaps, evidenceIssues),
    [logicGaps, evidenceIssues],
  );

  const totalIssues = logicGaps.length + evidenceIssues.length;

  const filteredLogicGaps = useMemo(
    () => filterIssuesBySeverity(logicGaps, selectedSeverity),
    [logicGaps, selectedSeverity],
  );
  const filteredEvidenceIssues = useMemo(
    () => filterIssuesBySeverity(evidenceIssues, selectedSeverity),
    [evidenceIssues, selectedSeverity],
  );
  const filteredCount = filteredLogicGaps.length + filteredEvidenceIssues.length;

  const displayCount = selectedSeverity === 'all' ? totalIssues : filteredCount;

  const handleItemClick = (id: string) => {
    setSelectedIssueId(selectedIssueId === id ? null : id);
  };

  const getTabCount = (key: Severity | 'all') => {
    if (key === 'all') return totalIssues;
    return severityCounts[key];
  };

  const getTabColorClass = (key: Severity | 'all', isActive: boolean) => {
    if (!isActive) return 'text-gray-500 hover:text-gray-300 hover:bg-white/5';
    switch (key) {
      case 'all':
        return 'text-gray-200 bg-white/10';
      case 'high':
        return 'text-red-400 bg-red-500/10';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10';
    }
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
            {displayCount} 项
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="flex gap-1 mb-3 p-1 bg-surface-dark/50 rounded-lg">
            {FILTER_TABS.map((tab) => {
              const isActive = selectedSeverity === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedSeverity(tab.key)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all duration-200 ${getTabColorClass(
                    tab.key,
                    isActive,
                  )}`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 opacity-70">{getTabCount(tab.key)}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {filteredCount === 0 ? (
              <div className="py-6 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-gray-500">
                  {selectedSeverity === 'all'
                    ? '未检测到明显问题'
                    : `暂无${FILTER_TABS.find((t) => t.key === selectedSeverity)?.label}级别问题`}
                </p>
              </div>
            ) : (
              <>
                {filteredLogicGaps.map((gap) => (
                  <IssueCard
                    key={gap.id}
                    id={gap.id}
                    isSelected={selectedIssueId === gap.id}
                    onClick={() => handleItemClick(gap.id)}
                    data={gap}
                    type="gap"
                  />
                ))}
                {filteredEvidenceIssues.map((issue) => (
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
  const severity = getIssueSeverity(data);
  const colorClass =
    severity === 'high'
      ? 'text-red-400'
      : severity === 'medium'
        ? 'text-amber-400'
        : 'text-emerald-400';
  const bgClass = isSelected
    ? severity === 'high'
      ? 'bg-red-500/10 border-red-500/40'
      : severity === 'medium'
        ? 'bg-amber-500/10 border-amber-500/40'
        : 'bg-emerald-500/10 border-emerald-500/40'
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
            <PriorityBadge priority={severity} label="" />
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
