import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FilterProvider } from "../src/context/filter-context";
import { DashboardPage } from "../src/pages/dashboard-page";

describe("dashboard_page", () => {
  it("renders_freshness_and_panels_when_response_ok", async () => {
    const client = {
      load: async () => ({
        status: "ok" as const,
        payload: {
          filters: {
            projects: ["A"],
            dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-31T23:59:59.000Z" }
          },
          projects: [
            {
              projectKey: "A",
              flow: {
                throughput: { value: 1, state: "ok" as const, unit: "count" as const },
                cycleTimeDays: { value: 2, state: "ok" as const, unit: "days" as const }
              },
              predictability: {
                commitmentReliability: { value: 1, state: "ok" as const, unit: "ratio" as const },
                spilloverRate: { value: 0, state: "ok" as const, unit: "ratio" as const }
              },
              quality: {
                defectRate: { value: 0, state: "ok" as const, unit: "ratio" as const },
                reopenRate: { value: 0, state: "ok" as const, unit: "ratio" as const }
              },
              partialData: false,
              notes: []
            }
          ],
          aggregate: {
            bestThroughputProject: "A",
            bestCycleTimeProject: "A",
            bestQualityProject: "A"
          },
          freshness: {
            refreshedAt: "2026-07-10T00:00:00.000Z",
            state: "fresh" as const,
            source: "jira-mcp" as const
          },
          dependencyUnavailable: false
        }
      })
    };

    render(
      <FilterProvider>
        <DashboardPage client={client as never} />
      </FilterProvider>
    );

    await waitFor(() => expect(screen.getByText(/Freshness: fresh/)).toBeInTheDocument());
  });

  it("renders_dependency_unavailable_fallback_message", async () => {
    const client = {
      load: async () => ({
        status: "dependency-unavailable" as const,
        message: "Jira down",
        fallbackPayload: null
      })
    };

    render(
      <FilterProvider>
        <DashboardPage client={client as never} />
      </FilterProvider>
    );

    await waitFor(() => expect(screen.getByText("Jira MCP unavailable")).toBeInTheDocument());
  });
});
