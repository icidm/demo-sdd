import { describe, expect, it } from "vitest";
import { aggregateComparison, computeProjectKpis } from "../src/domain/kpi-engine";

describe("kpi_engine", () => {
  it("computes_zero_activity_state", () => {
    const group = computeProjectKpis("A", []);
    expect(group.flow.totalIssues.state).toBe("zero-activity");
  });

  it("computes_completion_rate_and_defect_rate_from_real_fields", () => {
    const group = computeProjectKpis("A", [
      {
        projectKey: "A",
        isDone: true,
        cycleTimeDays: 2,
        ageDays: null,
        isDefect: false,
        hasAssignee: true
      },
      {
        projectKey: "A",
        isDone: false,
        cycleTimeDays: null,
        ageDays: 5,
        isDefect: true,
        hasAssignee: false
      }
    ]);
    expect(group.flow.totalIssues.value).toBe(2);
    expect(group.flow.completedIssues.value).toBe(1);
    expect(group.backlogHealth.completionRate.value).toBe(0.5);
    expect(group.backlogHealth.avgOpenAgeDays.value).toBe(5);
    expect(group.quality.defectRate.value).toBe(0.5);
    expect(group.quality.unassignedRate.value).toBe(0.5);
    expect(group.partialData).toBe(false);
  });

  it("aggregates_best_projects", () => {
    const a = computeProjectKpis("A", [
      {
        projectKey: "A",
        isDone: true,
        cycleTimeDays: 1,
        ageDays: null,
        isDefect: false,
        hasAssignee: true
      }
    ]);
    const b = computeProjectKpis("B", [
      {
        projectKey: "B",
        isDone: true,
        cycleTimeDays: 4,
        ageDays: null,
        isDefect: true,
        hasAssignee: true
      }
    ]);
    const aggregate = aggregateComparison([a, b]);
    expect(aggregate.bestThroughputProject).toBe("A");
    expect(aggregate.bestCycleTimeProject).toBe("A");
    expect(aggregate.bestQualityProject).toBe("A");
  });
});
