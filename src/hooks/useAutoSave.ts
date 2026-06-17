import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

const STORAGE_KEY = 'paper-logic-analyzer-draft';

export const useAutoSave = () => {
  const { text, template, setText, setTemplate } = useEditorStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.text) setText(data.text);
        if (data.template) setTemplate(data.template);
      }
    } catch {
      console.log('No saved draft found');
    }
  }, [setText, setTemplate]);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ text, template, savedAt: Date.now() }),
        );
      } catch {
        console.log('Failed to save draft');
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [text, template]);
};
