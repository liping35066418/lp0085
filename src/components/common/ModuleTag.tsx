import type { ModuleType } from '../../../shared/types';

interface ModuleTagProps {
  type: ModuleType;
  wordCount?: number;
  onClick?: () => void;
  active?: boolean;
}

const moduleStyles: Record<ModuleType, { bg: string; text: string; border: string; name: string }> = {
  introduction: {
    bg: 'bg-[#8b7fd4]/15',
    text: 'text-[#8b7fd4]',
    border: 'border-[#8b7fd4]/40',
    name: '绪论',
  },
  experiment: {
    bg: 'bg-[#4ecdc4]/15',
    text: 'text-[#4ecdc4]',
    border: 'border-[#4ecdc4]/40',
    name: '实验',
  },
  data: {
    bg: 'bg-[#f4a261]/15',
    text: 'text-[#f4a261]',
    border: 'border-[#f4a261]/40',
    name: '数据',
  },
  conclusion: {
    bg: 'bg-[#e76f8d]/15',
    text: 'text-[#e76f8d]',
    border: 'border-[#e76f8d]/40',
    name: '结论',
  },
};

export const ModuleTag = ({ type, wordCount, onClick, active }: ModuleTagProps) => {
  const style = moduleStyles[type];
  return (
    <button
      onClick={onClick}
      className={`tag-chip gap-1.5 border transition-all duration-200 ${style.bg} ${style.text} ${style.border} ${
        active ? 'ring-2 ring-offset-2 ring-offset-surface scale-105' : 'hover:scale-105'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
      <span className="font-semibold">{style.name}</span>
      {wordCount !== undefined && (
        <span className="opacity-70 text-[10px] ml-0.5">{wordCount}字</span>
      )}
    </button>
  );
};
