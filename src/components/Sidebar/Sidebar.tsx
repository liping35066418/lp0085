import { ScoreGauge } from './ScoreGauge';
import { IssueList } from './IssueList';
import { SuggestionList } from './SuggestionList';

export const Sidebar = () => {
  return (
    <aside
      className="w-[380px] flex-shrink-0 bg-surface-dark/30 border-l border-white/5 overflow-y-auto animate-slide-in-right"
    >
      <div className="p-4 space-y-4">
        <ScoreGauge />
        <IssueList />
        <SuggestionList />

        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] text-gray-600 text-center leading-relaxed">
            文本逻辑分析服务 · 端口 8835
            <br />
            修改文字实时更新分析结果
          </p>
        </div>
      </div>
    </aside>
  );
};
