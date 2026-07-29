import type { JiraIssue, NormalizedIssue } from "./types";

// Issue type names that represent defects across locales used in this Jira
// instance (Spanish "Incidencia" is the actual defect type name here).
const DEFECT_TYPE_NAMES = ["incidencia", "bug", "defect", "error"];

const isDefectType = (issueTypeName: string): boolean =>
  DEFECT_TYPE_NAMES.some((name) => issueTypeName.toLowerCase().includes(name));

const daysBetween = (fromIso: string, toIso: string): number =>
  Math.max(0, (Date.parse(toIso) - Date.parse(fromIso)) / (1000 * 60 * 60 * 24));

export const normalizeIssues = (issues: JiraIssue[]): NormalizedIssue[] => {
  const now = new Date().toISOString();

  return issues.map((issue) => ({
    projectKey: issue.projectKey,
    isDone: issue.isDone,
    cycleTimeDays: issue.isDone && issue.resolvedAt ? daysBetween(issue.createdAt, issue.resolvedAt) : null,
    ageDays: issue.isDone ? null : daysBetween(issue.createdAt, now),
    isDefect: isDefectType(issue.issueTypeName),
    hasAssignee: issue.hasAssignee
  }));
};
