import type { DashboardFilters } from "@demo/shared";
import type { JiraIssue, NormalizedIssue } from "./types";

const isInRange = (date: string | null, filters: DashboardFilters): boolean => {
  if (!date) {
    return false;
  }
  const value = Date.parse(date);
  const from = Date.parse(filters.dateRange.from);
  const to = Date.parse(filters.dateRange.to);
  return value >= from && value <= to;
};

export const normalizeIssues = (issues: JiraIssue[], filters: DashboardFilters): NormalizedIssue[] => {
  return issues.map((issue) => {
    const completedInRange = isInRange(issue.doneAt, filters);
    const cycleTimeDays = issue.doneAt
      ? Math.max(0, (Date.parse(issue.doneAt) - Date.parse(issue.createdAt)) / (1000 * 60 * 60 * 24))
      : null;

    return {
      projectKey: issue.projectKey,
      cycleTimeDays,
      reopened: issue.reopened,
      isDefect: issue.isDefect,
      committedInRange: issue.committedInRange,
      completedInRange
    };
  });
};
