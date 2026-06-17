import { useRef, useEffect, useMemo, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import type { ModuleType, LogicGap, EvidenceIssue } from '../../../shared/types';

const MODULE_COLORS: Record<ModuleType, string> = {
  introduction: 'rgba(139, 127, 212, 0.12)',
  experiment: 'rgba(78, 205, 196, 0.12)',
  data: 'rgba(244, 162, 97, 0.12)',
  conclusion: 'rgba(231, 111, 141, 0.12)',
};

const MODULE_BORDER: Record<ModuleType, string> = {
  introduction: '#8b7fd4',
  experiment: '#4ecdc4',
  data: '#f4a261',
  conclusion: '#e76f8d',
};

interface HoverInfo {
  type: 'gap' | 'evidence';
  description: string;
  suggestion?: string;
  x: number;
  y: number;
}

export const TextEditor = () => {
  const { text, setText, analysisResult, selectedIssueId, setSelectedIssueId, isAnalyzing } =
    useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const lineCount = useMemo(() => Math.max(1, text.split('\n').length), [text]);

  const modules = analysisResult?.modules ?? [];
  const logicGaps = analysisResult?.logicGaps ?? [];
  const evidenceIssues = analysisResult?.evidenceIssues ?? [];

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const renderHighlightedText = () => {
    if (!text) return null;

    const segments: Array<{
      text: string;
      bgColor: string;
      borderColor?: string;
      isGap?: boolean;
      isIssue?: EvidenceIssue;
    }> = [];

    const validModules = modules.filter((m) => m.startIndex >= 0);
    if (validModules.length === 0) {
      segments.push({ text, bgColor: 'transparent' });
    } else {
      let cursor = 0;
      validModules.forEach((module) => {
        if (module.startIndex > cursor) {
          segments.push({ text: text.slice(cursor, module.startIndex), bgColor: 'transparent' });
        }
        segments.push({
          text: text.slice(module.startIndex, module.endIndex),
          bgColor: MODULE_COLORS[module.type],
          borderColor: MODULE_BORDER[module.type],
        });
        cursor = module.endIndex;
      });
      if (cursor < text.length) {
        segments.push({ text: text.slice(cursor), bgColor: 'transparent' });
      }
    }

    return segments.map((seg, i) => (
      <span
        key={i}
        style={{
          backgroundColor: seg.bgColor,
          borderLeft: seg.borderColor ? `3px solid ${seg.borderColor}` : 'none',
          paddingLeft: seg.borderColor ? '4px' : '0',
        }}
      >
        {seg.text}
      </span>
    ));
  };

  useEffect(() => {
    if (selectedIssueId && textareaRef.current) {
      const gap = logicGaps.find((g) => g.id === selectedIssueId);
      const issue = evidenceIssues.find((e) => e.id === selectedIssueId);
      const target = gap ?? issue;
      if (target) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(target.startIndex, target.endIndex);
        const lines = text.slice(0, target.startIndex).split('\n').length;
        const lineHeight = 28;
        textareaRef.current.scrollTop = (lines - 1) * lineHeight - 60;
      }
    }
  }, [selectedIssueId, logicGaps, evidenceIssues, text]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!textareaRef.current) return;
    const rect = textareaRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    const charIndex = getCharIndexFromPosition(
      textareaRef.current,
      e.clientX - rect.left,
      e.clientY - rect.top,
    );

    const gap = logicGaps.find(
      (g) => charIndex >= g.startIndex - 2 && charIndex <= g.endIndex + 5,
    );
    const issue = evidenceIssues.find(
      (ev) => charIndex >= ev.startIndex && charIndex <= ev.endIndex,
    );

    if (gap) {
      setHoverInfo({
        type: 'gap',
        description: gap.description,
        suggestion: gap.suggestion,
        x,
        y,
      });
    } else if (issue) {
      setHoverInfo({
        type: 'evidence',
        description: issue.description,
        x,
        y,
      });
    } else {
      setHoverInfo(null);
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden flex">
      <div
        ref={lineNumbersRef}
        className="w-14 flex-shrink-0 bg-surface-dark/60 py-4 text-right pr-3 overflow-hidden border-r border-white/5 select-none"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className="text-xs text-gray-600 leading-7 h-7"
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={highlightRef}
          className="absolute inset-0 py-4 px-5 whitespace-pre-wrap break-words font-mono text-sm leading-7 text-transparent pointer-events-none overflow-hidden"
          aria-hidden="true"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {renderHighlightedText()}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onScroll={handleScroll}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverInfo(null)}
          placeholder="在此输入或粘贴实验论文初稿框架...

系统将自动识别绪论、实验、数据、结论四大模块，
检测逻辑断层与论据缺失，并给出框架优化建议。"
          className="relative w-full h-full py-4 px-5 bg-transparent text-gray-100 resize-none outline-none focus:outline-none font-mono text-sm leading-7 whitespace-pre-wrap break-words"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
          spellCheck={false}
        />

        {isAnalyzing && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-surface-elevated/90 rounded-full border border-primary/30 text-[10px] text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            正在分析
          </div>
        )}

        {hoverInfo && (
          <div
            className="fixed z-50 max-w-xs px-4 py-3 bg-surface-elevated border border-white/10 rounded-lg shadow-2xl animate-fade-in pointer-events-none"
            style={{
              left: Math.min(hoverInfo.x + 16, window.innerWidth - 320),
              top: hoverInfo.y + 16,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  hoverInfo.type === 'gap' ? 'bg-red-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-xs font-semibold text-gray-200">
                {hoverInfo.type === 'gap' ? '逻辑断层' : '论据问题'}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{hoverInfo.description}</p>
            {hoverInfo.suggestion && (
              <p className="text-xs text-primary mt-2 pt-2 border-t border-white/5 leading-relaxed">
                💡 {hoverInfo.suggestion}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function getCharIndexFromPosition(textarea: HTMLTextAreaElement, x: number, y: number): number {
  const style = window.getComputedStyle(textarea);
  const div = document.createElement('div');
  const props = [
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'whiteSpace',
    'wordWrap',
    'wordBreak',
  ];

  props.forEach((p) => {
    div.style.setProperty(p, style.getPropertyValue(p));
  });

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.width = `${textarea.clientWidth}px`;
  div.style.height = 'auto';

  const text = textarea.value;
  div.textContent = text;
  document.body.appendChild(div);

  const charWidth = div.offsetWidth > 0 ? div.offsetWidth / Math.max(1, text.length) : 8;
  const lineHeight = parseInt(style.lineHeight) || 28;
  const paddingLeft = parseInt(style.paddingLeft) || 0;
  const paddingTop = parseInt(style.paddingTop) || 0;
  const scrollTop = textarea.scrollTop;

  const line = Math.floor((y + scrollTop - paddingTop) / lineHeight);
  const col = Math.floor((x - paddingLeft) / charWidth);

  const lines = text.split('\n');
  let index = 0;
  for (let i = 0; i < line && i < lines.length; i++) {
    index += lines[i].length + 1;
  }
  index += Math.min(col, lines[line]?.length ?? 0);

  document.body.removeChild(div);
  return Math.max(0, Math.min(index, text.length));
}
