import type { Severity } from '../../../shared/types';

interface PriorityBadgeProps {
  priority: Severity;
  label?: string;
}

const priorityStyles: Record<Severity, { bg: string; text: string; dot: string; label: string }> = {
  high: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    dot: 'bg-red-400',
    label: '高',
  },
  medium: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    label: '中',
  },
  low: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    label: '低',
  },
};

export const PriorityBadge = ({ priority, label }: PriorityBadgeProps) => {
  const style = priorityStyles[priority];
  return (
    <span className={`tag-chip gap-1 ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span className="font-medium text-[10px] uppercase tracking-wider">{label ?? style.label}优先级</span>
    </span>
  );
};
