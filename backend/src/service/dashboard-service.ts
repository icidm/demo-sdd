import type { DashboardFilters, DashboardPayload, DashboardResponse } from "@demo/shared";
import { aggregateComparison, computeProjectKpis } from "../domain/kpi-engine";
import type { JiraMcpClient } from "../jira/client";
import { normalizeIssues } from "../jira/normalize";
import { validateFilters } from "../jira/validate-filters";
import type { SnapshotRepository } from "../persistence/snapshot-repository";

export class DashboardService {
  constructor(
    private readonly jiraClient: JiraMcpClient,
    private readonly snapshotRepository: SnapshotRepository
  ) {}

  async getDashboard(filters: DashboardFilters): Promise<DashboardResponse> {
    const validationError = validateFilters(filters);
    if (validationError) {
      return { status: "invalid-filter", message: validationError, fallbackPayload: null };
    }

    const projectResults = await Promise.all(
      filters.projects.map(async (projectKey) => {
        try {
          const issues = await this.jiraClient.fetchProjectIssues(projectKey, filters);
          const normalized = normalizeIssues(issues, filters);
          return { projectKey, normalized, failed: false };
        } catch {
          return { projectKey, normalized: [], failed: true };
        }
      })
    );

    const allFailed = projectResults.every((result) => result.failed);
    if (allFailed) {
      const fallback = await this.snapshotRepository.load();
      return {
        status: "dependency-unavailable",
        message: "Jira MCP is unavailable.",
        fallbackPayload: fallback
          ? {
              ...fallback,
              freshness: { ...fallback.freshness, state: "stale", source: "snapshot" },
              dependencyUnavailable: true
            }
          : null
      };
    }

    const projects = projectResults.map((result) => {
      const group = computeProjectKpis(result.projectKey, result.normalized);
      if (result.failed) {
        return {
          ...group,
          partialData: true,
          notes: [...group.notes, "Project data is unavailable from Jira MCP."]
        };
      }
      return group;
    });

    const payload: DashboardPayload = {
      filters,
      projects,
      aggregate: aggregateComparison(projects),
      freshness: {
        refreshedAt: new Date().toISOString(),
        state: "fresh",
        source: "jira-mcp"
      },
      dependencyUnavailable: projectResults.some((result) => result.failed)
    };

    try {
      await this.snapshotRepository.save(payload);
    } catch {
      // Snapshot persistence is best-effort for PoC continuity.
    }

    return { status: "ok", payload };
  }
}
