import type { KpiValue, ProjectKpiGroup, AggregateComparison } from "@demo/shared";
import type { NormalizedIssue } from "../jira/types";

const ratio = (numerator: number, denominator: number): number | null => {
  if (denominator === 0) {
    return null;
  }
  return numerator / denominator;
};

const okValue = (value: number | null, unit: KpiValue["unit"]): KpiValue => {
  if (value === null) {
    return { value: null, state: "insufficient-data", unit };
  }
  return { value, state: "ok", unit };
};

const average = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const zeroActivityGroup = (projectKey: string): ProjectKpiGroup => {
  const unavailable = (unit: KpiValue["unit"]): KpiValue => ({ value: null, state: "zero-activity", unit });
  return {
    projectKey,
    flow: {
      totalIssues: unavailable("count"),
      completedIssues: unavailable("count"),
      cycleTimeDays: unavailable("days")
    },
    backlogHealth: {
      completionRate: unavailable("ratio"),
      avgOpenAgeDays: unavailable("days")
    },
    quality: {
      defectRate: unavailable("ratio"),
      unassignedRate: unavailable("ratio")
    },
    partialData: false,
    notes: ["No activity in selected range."]
  };
};

/**
 * Computes KPIs from fields Jira populates on virtually every issue (status
 * category, issue type, assignee, created/resolution dates) so every metric
 * carries a real value whenever the project has at least one issue in range,
 * instead of depending on optional agile concepts this Jira instance does
 * not expose reliably (sprint commitment, reopen history).
 */
export const computeProjectKpis = (projectKey: string, issues: NormalizedIssue[]): ProjectKpiGroup => {
  if (issues.length === 0) {
    return zeroActivityGroup(projectKey);
  }

  const completed = issues.filter((issue) => issue.isDone);
  const open = issues.filter((issue) => !issue.isDone);
  const defects = issues.filter((issue) => issue.isDefect);
  const unassigned = issues.filter((issue) => !issue.hasAssignee);
  const cycleTimes = completed.map((issue) => issue.cycleTimeDays).filter((value): value is number => value !== null);
  const openAges = open.map((issue) => issue.ageDays).filter((value): value is number => value !== null);

  const totalIssues = issues.length;
  const completionRate = ratio(completed.length, totalIssues);
  const defectRate = ratio(defects.length, totalIssues);
  const unassignedRate = ratio(unassigned.length, totalIssues);
  const avgCycleTime = average(cycleTimes);
  const avgOpenAge = average(openAges);

  const notes: string[] = [];
  if (avgCycleTime === null) {
    notes.push("Cycle time is unavailable because no issues were completed in range.");
  }
  if (avgOpenAge === null) {
    notes.push("Open issue age is unavailable because every issue in range is already completed.");
  }
  // partialData flags a fetch problem (set by the caller when the live MCP
  // call failed), not the normal case of an empty completed/open bucket —
  // those are legitimate outcomes already conveyed per-metric via KpiValue.state.
  const partialData = false;

  return {
    projectKey,
    flow: {
      totalIssues: okValue(totalIssues, "count"),
      completedIssues: okValue(completed.length, "count"),
      cycleTimeDays: okValue(avgCycleTime, "days")
    },
    backlogHealth: {
      completionRate: okValue(completionRate, "ratio"),
      avgOpenAgeDays: okValue(avgOpenAge, "days")
    },
    quality: {
      defectRate: okValue(defectRate, "ratio"),
      unassignedRate: okValue(unassignedRate, "ratio")
    },
    partialData,
    notes
  };
};

export const aggregateComparison = (projects: ProjectKpiGroup[]): AggregateComparison => {
  const bestBy = (
    pick: (project: ProjectKpiGroup) => number | null,
    mode: "max" | "min"
  ): string | null => {
    const candidates = projects
      .map((project) => ({ projectKey: project.projectKey, value: pick(project) }))
      .filter((candidate): candidate is { projectKey: string; value: number } => candidate.value !== null);
    if (candidates.length === 0) {
      return null;
    }
    const winner = candidates.reduce((prev, next) => {
      if (mode === "max") {
        return next.value > prev.value ? next : prev;
      }
      return next.value < prev.value ? next : prev;
    });
    return winner.projectKey;
  };

  return {
    bestThroughputProject: bestBy((project) => project.flow.completedIssues.value, "max"),
    bestCycleTimeProject: bestBy((project) => project.flow.cycleTimeDays.value, "min"),
    bestQualityProject: bestBy((project) => project.quality.defectRate.value, "min")
  };
};
