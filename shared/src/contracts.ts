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

export type ProjectKpiGroup = {
  projectKey: string;
  flow: {
    throughput: KpiValue;
    cycleTimeDays: KpiValue;
  };
  predictability: {
    commitmentReliability: KpiValue;
    spilloverRate: KpiValue;
  };
  quality: {
    defectRate: KpiValue;
    reopenRate: KpiValue;
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
  state: "fresh" | "stale";
  source: "jira-mcp" | "snapshot";
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
