import { ModuleBar } from './ModuleBar';
import { TextEditor } from './TextEditor';

export const EditorSection = () => {
  return (
    <section className="flex-1 flex flex-col min-w-0 animate-fade-in">
      <ModuleBar />
      <TextEditor />
    </section>
  );
};
