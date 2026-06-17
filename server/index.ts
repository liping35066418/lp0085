import express from 'express';
import cors from 'cors';
import {
  detectModules,
  detectLogicGaps,
  detectEvidenceIssues,
  calculateScores,
  generateSuggestions,
  getTemplate,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type TemplateType,
} from '../shared/index';

const app = express();
const PORT = 8835;

app.use(
  cors({
    origin: ['http://localhost:3835', 'http://127.0.0.1:3835'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT, timestamp: new Date().toISOString() });
});

app.get('/api/templates/:type', (req, res) => {
  const type = req.params.type as TemplateType;
  if (type !== 'engineering' && type !== 'biology') {
    return res.status(400).json({ error: 'Invalid template type' });
  }
  res.json(getTemplate(type));
});

app.post('/api/analyze', (req, res) => {
  try {
    const { text, template } = req.body as AnalyzeRequest;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!template || (template !== 'engineering' && template !== 'biology')) {
      return res.status(400).json({ error: 'Valid template type is required' });
    }

    const modules = detectModules(text, template);
    const logicGaps = detectLogicGaps(text, modules, template);
    const evidenceIssues = detectEvidenceIssues(text, modules);
    const scores = calculateScores(modules, logicGaps, evidenceIssues);
    const suggestions = generateSuggestions(modules, logicGaps, evidenceIssues, template);

    const response: AnalyzeResponse = {
      modules,
      logicGaps,
      evidenceIssues,
      scores,
      suggestions,
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Paper Logic Analyzer API running on http://localhost:${PORT}`);
});
