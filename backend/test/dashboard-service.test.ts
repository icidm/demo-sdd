import { describe, expect, it } from "vitest";
import type { DashboardFilters } from "@demo/shared";
import { DashboardService } from "../src/service/dashboard-service";
import type { JiraMcpClient } from "../src/jira/client";

const filters: DashboardFilters = {
  projects: ["A", "B"],
  dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-31T23:59:59.000Z" }
};

describe("dashboard_service", () => {
  it("returns_invalid_filter_when_projects_missing", async () => {
    const jiraClient: JiraMcpClient = {
      fetchProjectIssues: async () => []
    };

    const service = new DashboardService(jiraClient);
    const result = await service.getDashboard({ ...filters, projects: [] });
    expect(result.status).toBe("invalid-filter");
  });

  it("returns_dependency_unavailable_with_no_fallback_payload_when_all_projects_fail", async () => {
    const jiraClient: JiraMcpClient = {
      fetchProjectIssues: async () => {
        throw new Error("dependency down");
      }
    };

    const service = new DashboardService(jiraClient);
    const result = await service.getDashboard(filters);
    expect(result.status).toBe("dependency-unavailable");
    if (result.status === "dependency-unavailable") {
      expect(result.fallbackPayload).toBeNull();
      expect(result.message).toContain("dependency down");
    }
  });

  it("returns_partial_data_when_one_project_fails", async () => {
    const jiraClient: JiraMcpClient = {
      fetchProjectIssues: async (projectKey) => {
        if (projectKey === "B") {
          throw new Error("missing");
        }
        return [
          {
            key: "A-1",
            projectKey: "A",
            createdAt: "2026-07-10T00:00:00.000Z",
            resolvedAt: "2026-07-12T00:00:00.000Z",
            isDone: true,
            issueTypeName: "Historia",
            hasAssignee: true
          }
        ];
      }
    };

    const service = new DashboardService(jiraClient);
    const result = await service.getDashboard(filters);
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.payload.dependencyUnavailable).toBe(true);
      expect(result.payload.projects.some((project) => project.projectKey === "B" && project.partialData)).toBe(true);
    }
  });
});
