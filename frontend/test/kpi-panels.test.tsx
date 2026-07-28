import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiPanels } from "../src/components/kpi-panels";

describe("kpi_panels", () => {
  it("renders_group_values_and_partial_state", () => {
    render(
      <KpiPanels
        projects={[
          {
            projectKey: "A",
            flow: {
              totalIssues: { value: 12, state: "ok", unit: "count" },
              completedIssues: { value: 10, state: "ok", unit: "count" },
              cycleTimeDays: { value: 2.5, state: "ok", unit: "days" }
            },
            backlogHealth: {
              completionRate: { value: 0.8, state: "ok", unit: "ratio" },
              avgOpenAgeDays: { value: 3, state: "ok", unit: "days" }
            },
            quality: {
              defectRate: { value: 0.1, state: "ok", unit: "ratio" },
              unassignedRate: { value: 0.02, state: "ok", unit: "ratio" }
            },
            partialData: true,
            notes: ["Missing source field"]
          }
        ]}
      />
    );

    expect(screen.getByTestId("kpi-A")).toBeInTheDocument();
    expect(screen.getByText("⚠️ Partial data - Some issues may be missing")).toBeInTheDocument();
  });
});
