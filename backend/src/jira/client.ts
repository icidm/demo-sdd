import type { DashboardFilters } from "@demo/shared";
import type { JiraIssue } from "./types";

export interface JiraMcpClient {
  fetchProjectIssues(projectKey: string, filters: DashboardFilters): Promise<JiraIssue[]>;
}
