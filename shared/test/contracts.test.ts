import { describe, expect, it } from "vitest";
import type { DashboardPayload } from "../src/contracts";

describe("shared_contracts", () => {
  it("supports_backend_frontend_payload_contract_shape", () => {
    const payload: DashboardPayload = {
      filters: {
        projects: ["IOP"],
        dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-31T23:59:59.000Z" }
      },
      projects: [],
      aggregate: {
        bestThroughputProject: null,
        bestCycleTimeProject: null,
        bestQualityProject: null
      },
      freshness: {
        refreshedAt: null,
        state: "stale",
        source: "snapshot"
      },
      dependencyUnavailable: true
    };

    expect(payload.freshness.state).toBe("stale");
    expect(payload.filters.projects.length).toBe(1);
  });
});
