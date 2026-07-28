export type JiraIssue = {
  key: string;
  projectKey: string;
  createdAt: string;
  doneAt: string | null;
  reopened: boolean;
  isDefect: boolean;
  committedInRange: boolean;
};

export type NormalizedIssue = {
  projectKey: string;
  cycleTimeDays: number | null;
  reopened: boolean;
  isDefect: boolean;
  committedInRange: boolean;
  completedInRange: boolean;
};
