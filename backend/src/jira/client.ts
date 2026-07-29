import type { DashboardFilters } from "@demo/shared";
import type { JiraIssue } from "./types";

export interface JiraMcpClient {
  getAvailableProjects(): Promise<Array<{ key: string; name: string }>>;
  getCurrentUser(): Promise<{ name: string; email: string; displayName: string }>;
  fetchProjectIssues(projectKey: string, filters: DashboardFilters): Promise<JiraIssue[]>;
}
