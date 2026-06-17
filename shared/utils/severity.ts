import type { EvidenceIssue, LogicGap, Severity } from '../types';

export const EVIDENCE_SEVERITY_MAP: Record<EvidenceIssue['type'], Severity> = {
  missing_data: 'high',
  weak_argument: 'medium',
  no_citation: 'low',
};

export const getEvidenceSeverity = (type: EvidenceIssue['type']): Severity => {
  return EVIDENCE_SEVERITY_MAP[type];
};

export const getIssueSeverity = (issue: LogicGap | EvidenceIssue): Severity => {
  if ('severity' in issue) {
    return issue.severity;
  }
  return getEvidenceSeverity(issue.type);
};

export const countBySeverity = (
  logicGaps: LogicGap[],
  evidenceIssues: EvidenceIssue[],
): Record<Severity, number> => {
  const counts: Record<Severity, number> = { high: 0, medium: 0, low: 0 };

  logicGaps.forEach((gap) => {
    counts[gap.severity]++;
  });

  evidenceIssues.forEach((issue) => {
    counts[getEvidenceSeverity(issue.type)]++;
  });

  return counts;
};

export const filterIssuesBySeverity = <T extends LogicGap | EvidenceIssue>(
  issues: T[],
  severity: Severity | 'all',
): T[] => {
  if (severity === 'all') return issues;
  return issues.filter((issue) => getIssueSeverity(issue) === severity);
};
