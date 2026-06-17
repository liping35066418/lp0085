import { TopToolbar } from './components/Toolbar/TopToolbar';
import { EditorSection } from './components/Editor/EditorSection';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useTextAnalysis } from './hooks/useTextAnalysis';
import { useAutoSave } from './hooks/useAutoSave';

function App() {
  useTextAnalysis();
  useAutoSave();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface">
      <TopToolbar />
      <main className="flex-1 flex min-h-0 overflow-hidden">
        <EditorSection />
        <Sidebar />
      </main>
    </div>
  );
}

export default App;
