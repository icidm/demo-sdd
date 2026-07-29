import type { DashboardFilters, DashboardPayload, DashboardResponse } from "@demo/shared";
import { aggregateComparison, computeProjectKpis } from "../domain/kpi-engine";
import type { JiraMcpClient } from "../jira/client";
import { normalizeIssues } from "../jira/normalize";
import { validateFilters } from "../jira/validate-filters";

export class DashboardService {
  constructor(private readonly jiraClient: JiraMcpClient) {}

  async getDashboard(filters: DashboardFilters): Promise<DashboardResponse> {
    const validationError = validateFilters(filters);
    if (validationError) {
      return { status: "invalid-filter", message: validationError, fallbackPayload: null };
    }

    const projectResults = await Promise.all(
      filters.projects.map(async (projectKey) => {
        try {
          const issues = await this.jiraClient.fetchProjectIssues(projectKey, filters);
          const normalized = normalizeIssues(issues);
          return { projectKey, normalized, failed: false, error: null as Error | null };
        } catch (error) {
          console.error(`[DashboardService] Failed to fetch live Jira data for ${projectKey}:`, error);
          return { projectKey, normalized: [], failed: true, error: error as Error };
        }
      })
    );

    const allFailed = projectResults.every((result) => result.failed);
    if (allFailed) {
      // No fallback to stale/snapshot data: the user must see the truth that
      // live Jira MCP data could not be retrieved, never a substitute payload.
      const detail = projectResults
        .map((result) => `${result.projectKey}: ${result.error?.message ?? "unknown error"}`)
        .join("; ");
      return {
        status: "dependency-unavailable",
        message: `Jira MCP is unavailable. ${detail}`,
        fallbackPayload: null
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

    return { status: "ok", payload };
  }
}
