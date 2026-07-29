import { describe, expect, it } from "vitest";
import { DashboardController } from "../src/api/dashboard-controller";

describe("dashboard_controller", () => {
  it("maps_read_request_to_service_response", async () => {
    const service = {
      getDashboard: async () => ({ status: "invalid-filter", message: "x", fallbackPayload: null as null })
    };

    const controller = new DashboardController(service as never);
    const response = await controller.readDashboard({
      projects: [],
      dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-02T00:00:00.000Z" }
    });

    expect(response.status).toBe("invalid-filter");
  });
});
