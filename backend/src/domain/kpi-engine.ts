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

export const computeProjectKpis = (projectKey: string, issues: NormalizedIssue[]): ProjectKpiGroup => {
  if (issues.length === 0) {
    const unavailable = { value: null, state: "zero-activity", unit: "count" } as KpiValue;
    return {
      projectKey,
      flow: {
        throughput: unavailable,
        cycleTimeDays: { ...unavailable, unit: "days" }
      },
      predictability: {
        commitmentReliability: { ...unavailable, unit: "ratio" },
        spilloverRate: { ...unavailable, unit: "ratio" }
      },
      quality: {
        defectRate: { ...unavailable, unit: "ratio" },
        reopenRate: { ...unavailable, unit: "ratio" }
      },
      partialData: false,
      notes: ["No activity in selected range."]
    };
  }

  const completed = issues.filter((issue) => issue.completedInRange);
  const committed = issues.filter((issue) => issue.committedInRange);
  const defects = issues.filter((issue) => issue.isDefect);
  const reopened = issues.filter((issue) => issue.reopened);
  const cycleTimes = completed.map((issue) => issue.cycleTimeDays).filter((value): value is number => value !== null);

  const throughput = completed.length;
  const commitmentReliability = ratio(completed.length, committed.length);
  const spilloverRate = ratio(Math.max(committed.length - completed.length, 0), committed.length);
  const defectRate = ratio(defects.length, issues.length);
  const reopenRate = ratio(reopened.length, completed.length);

  const notes: string[] = [];
  const partialData = commitmentReliability === null || reopenRate === null;
  if (partialData) {
    notes.push("One or more KPIs are unavailable because source data is incomplete.");
  }

  return {
    projectKey,
    flow: {
      throughput: throughput === 0 ? { value: 0, state: "zero-activity", unit: "count" } : okValue(throughput, "count"),
      cycleTimeDays: okValue(average(cycleTimes), "days")
    },
    predictability: {
      commitmentReliability: okValue(commitmentReliability, "ratio"),
      spilloverRate: okValue(spilloverRate, "ratio")
    },
    quality: {
      defectRate: okValue(defectRate, "ratio"),
      reopenRate: okValue(reopenRate, "ratio")
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
    bestThroughputProject: bestBy((project) => project.flow.throughput.value, "max"),
    bestCycleTimeProject: bestBy((project) => project.flow.cycleTimeDays.value, "min"),
    bestQualityProject: bestBy((project) => project.quality.defectRate.value, "min")
  };
};
