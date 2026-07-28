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
              throughput: { value: 10, state: "ok", unit: "count" },
              cycleTimeDays: { value: 2.5, state: "ok", unit: "days" }
            },
            predictability: {
              commitmentReliability: { value: 0.8, state: "ok", unit: "ratio" },
              spilloverRate: { value: 0.2, state: "ok", unit: "ratio" }
            },
            quality: {
              defectRate: { value: 0.1, state: "ok", unit: "ratio" },
              reopenRate: { value: 0.02, state: "ok", unit: "ratio" }
            },
            partialData: true,
            notes: ["Missing source field"]
          }
        ]}
      />
    );

    expect(screen.getByTestId("kpi-A")).toBeInTheDocument();
    expect(screen.getByText("Partial data")).toBeInTheDocument();
  });
});
