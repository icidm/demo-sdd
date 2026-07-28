import { describe, expect, it } from "vitest";
import type { DashboardFilters } from "@demo/shared";
import { DashboardService } from "../src/service/dashboard-service";
import type { JiraMcpClient } from "../src/jira/client";
import type { SnapshotRepository } from "../src/persistence/snapshot-repository";

const filters: DashboardFilters = {
  projects: ["A", "B"],
  dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-31T23:59:59.000Z" }
};

describe("dashboard_service", () => {
  it("returns_invalid_filter_when_projects_missing", async () => {
    const jiraClient: JiraMcpClient = {
      fetchProjectIssues: async () => []
    };
    const snapshotRepository: SnapshotRepository = {
      save: async () => undefined,
      load: async () => null
    };

    const service = new DashboardService(jiraClient, snapshotRepository);
    const result = await service.getDashboard({ ...filters, projects: [] });
    expect(result.status).toBe("invalid-filter");
  });

  it("returns_dependency_unavailable_with_snapshot_fallback", async () => {
    const jiraClient: JiraMcpClient = {
      fetchProjectIssues: async () => {
        throw new Error("dependency down");
      }
    };

    const snapshotRepository: SnapshotRepository = {
      save: async () => undefined,
      load: async () => ({
        filters,
        projects: [],
        aggregate: {
          bestCycleTimeProject: null,
          bestQualityProject: null,
          bestThroughputProject: null
        },
        freshness: {
          refreshedAt: "2026-07-15T00:00:00.000Z",
          source: "snapshot",
          state: "stale"
        },
        dependencyUnavailable: false
      })
    };

    const service = new DashboardService(jiraClient, snapshotRepository);
    const result = await service.getDashboard(filters);
    expect(result.status).toBe("dependency-unavailable");
    if (result.status === "dependency-unavailable") {
      expect(result.fallbackPayload?.freshness.source).toBe("snapshot");
      expect(result.fallbackPayload?.dependencyUnavailable).toBe(true);
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
            doneAt: "2026-07-12T00:00:00.000Z",
            reopened: false,
            isDefect: false,
            committedInRange: true
          }
        ];
      }
    };
    const snapshotRepository: SnapshotRepository = {
      save: async () => undefined,
      load: async () => null
    };

    const service = new DashboardService(jiraClient, snapshotRepository);
    const result = await service.getDashboard(filters);
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.payload.dependencyUnavailable).toBe(true);
      expect(result.payload.projects.some((project) => project.projectKey === "B" && project.partialData)).toBe(true);
    }
  });
});
