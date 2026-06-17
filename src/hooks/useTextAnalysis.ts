import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { analyzeText } from '../services/api';

export const useTextAnalysis = () => {
  const { text, template, setAnalysisResult, setIsAnalyzing } = useEditorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!text.trim()) {
      setAnalysisResult(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeText(text, template);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, template, setAnalysisResult, setIsAnalyzing]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(runAnalysis, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runAnalysis]);

  useEffect(() => {
    runAnalysis();
  }, [template, runAnalysis]);

  return { runAnalysis };
};
