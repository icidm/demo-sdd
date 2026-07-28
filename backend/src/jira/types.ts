/**
 * Raw issue shape produced by the Jira MCP client, using only fields Jira
 * populates on virtually every issue: created date, status category
 * ("new" | "indeterminate" | "done", locale-independent), issue type name,
 * resolution date (set only once status category is "done") and assignee.
 */
export type JiraIssue = {
  key: string;
  projectKey: string;
  createdAt: string;
  resolvedAt: string | null;
  isDone: boolean;
  issueTypeName: string;
  hasAssignee: boolean;
};

export type NormalizedIssue = {
  projectKey: string;
  isDone: boolean;
  cycleTimeDays: number | null;
  ageDays: number | null;
  isDefect: boolean;
  hasAssignee: boolean;
};
