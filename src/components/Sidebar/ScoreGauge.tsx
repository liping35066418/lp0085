import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#fbbf24';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 60) return '合格';
  if (score >= 40) return '待改进';
  return '需完善';
};

export const ScoreGauge = () => {
  const { scores, isAnalyzing } = useEditorStore((state) => ({
    scores: state.analysisResult?.scores,
    isAnalyzing: state.isAnalyzing,
  }));
  const [displayScore, setDisplayScore] = useState(0);

  const overall = scores?.overall ?? 0;
  const color = getScoreColor(overall);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  useEffect(() => {
    if (isAnalyzing) return;
    const start = displayScore;
    const end = overall;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [overall, isAnalyzing]);

  return (
    <div className="glass-panel-elevated p-5 flex flex-col items-center animate-fade-in">
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
        论文完整度
      </div>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#252b45"
            strokeWidth="10"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: isAnalyzing ? 'none' : 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-serif font-bold transition-colors duration-500"
            style={{ color }}
          >
            {displayScore}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {isAnalyzing ? '分析中' : getScoreLabel(overall)}
          </span>
        </div>
      </div>

      <div className="w-full mt-5 space-y-3">
        <ScoreBar label="模块完整性" score={scores?.moduleCompleteness ?? 0} color="#8b7fd4" />
        <ScoreBar label="逻辑连贯性" score={scores?.logicFlow ?? 0} color="#4ecdc4" />
        <ScoreBar label="论据充分度" score={scores?.evidenceSufficiency ?? 0} color="#f4a261" />
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const start = displayScore;
    const end = score;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = setTimeout(() => requestAnimationFrame(animate), 200);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-gray-400">{label}</span>
        <span className="text-[11px] font-mono font-semibold" style={{ color }}>
          {displayScore}
        </span>
      </div>
      <div className="h-1.5 bg-surface-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${displayScore}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
};
