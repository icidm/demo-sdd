import { describe, expect, it } from "vitest";
import { aggregateComparison, computeProjectKpis } from "../src/domain/kpi-engine";

describe("kpi_engine", () => {
  it("computes_zero_activity_state", () => {
    const group = computeProjectKpis("A", []);
    expect(group.flow.throughput.state).toBe("zero-activity");
  });

  it("computes_insufficient_data_for_missing_commitment", () => {
    const group = computeProjectKpis("A", [
      {
        projectKey: "A",
        cycleTimeDays: 2,
        reopened: false,
        isDefect: false,
        committedInRange: false,
        completedInRange: true
      }
    ]);
    expect(group.predictability.commitmentReliability.state).toBe("insufficient-data");
    expect(group.partialData).toBe(true);
  });

  it("aggregates_best_projects", () => {
    const a = computeProjectKpis("A", [
      {
        projectKey: "A",
        cycleTimeDays: 1,
        reopened: false,
        isDefect: false,
        committedInRange: true,
        completedInRange: true
      }
    ]);
    const b = computeProjectKpis("B", [
      {
        projectKey: "B",
        cycleTimeDays: 4,
        reopened: true,
        isDefect: true,
        committedInRange: true,
        completedInRange: true
      }
    ]);
    const aggregate = aggregateComparison([a, b]);
    expect(aggregate.bestThroughputProject).toBe("A");
    expect(aggregate.bestCycleTimeProject).toBe("A");
    expect(aggregate.bestQualityProject).toBe("A");
  });
});
