export type DateRange = {
  from: string;
  to: string;
};

export type DashboardFilters = {
  projects: string[];
  dateRange: DateRange;
};

export type KpiValue = {
  value: number | null;
  state: "ok" | "insufficient-data" | "zero-activity" | "unavailable";
  unit: "count" | "ratio" | "days";
};

/**
 * KPIs derived only from Jira fields that are populated on virtually every
 * issue (created, status category, issue type, assignee, resolution date),
 * so they carry real values in the vast majority of projects/date ranges
 * instead of depending on optional agile concepts (sprint commitment,
 * reopen history) that this Jira instance does not expose reliably.
 */
export type ProjectKpiGroup = {
  projectKey: string;
  flow: {
    totalIssues: KpiValue;
    completedIssues: KpiValue;
    cycleTimeDays: KpiValue;
  };
  backlogHealth: {
    completionRate: KpiValue;
    avgOpenAgeDays: KpiValue;
  };
  quality: {
    defectRate: KpiValue;
    unassignedRate: KpiValue;
  };
  partialData: boolean;
  notes: string[];
};

export type AggregateComparison = {
  bestThroughputProject: string | null;
  bestCycleTimeProject: string | null;
  bestQualityProject: string | null;
};

export type DataFreshness = {
  refreshedAt: string | null;
  state: "fresh";
  source: "jira-mcp";
};

export type DashboardPayload = {
  filters: DashboardFilters;
  projects: ProjectKpiGroup[];
  aggregate: AggregateComparison;
  freshness: DataFreshness;
  dependencyUnavailable: boolean;
};

export type DashboardResponse =
  | {
      status: "ok";
      payload: DashboardPayload;
    }
  | {
      status: "invalid-filter" | "dependency-unavailable";
      message: string;
      fallbackPayload: DashboardPayload | null;
    };
