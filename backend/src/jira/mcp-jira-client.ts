import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { DashboardFilters } from "@demo/shared";
import type { JiraIssue } from "./types";
import type { JiraMcpClient } from "./client";

const JIRA_MCP_URL = "https://api.inditex.com/mcp-jira/mcp";

/**
 * Jira MCP Client — connects directly to the real Jira MCP server (HTTP) and
 * calls its tools live on every request. NO REST fallback, NO cached files,
 * NO invented/hardcoded data. If the MCP call fails, the error propagates so
 * the caller can surface it truthfully instead of showing fake data.
 */
export class McpJiraClient implements JiraMcpClient {
  private client: Client | null = null;
  private connecting: Promise<Client> | null = null;

  /**
   * Lazily connects to the Jira MCP server over Streamable HTTP.
   * Reuses the same session for subsequent tool calls; each tool call still
   * fetches fresh data from Jira — only the transport connection is reused.
   */
  private async getClient(): Promise<Client> {
    if (this.client) {
      return this.client;
    }
    if (this.connecting) {
      return this.connecting;
    }

    const token = process.env.JIRA_TOKEN;
    if (!token) {
      throw new Error(
        "JIRA_TOKEN environment variable is not set. Create backend/.env with JIRA_TOKEN=<your Jira MCP token>."
      );
    }

    this.connecting = (async () => {
      const transport = new StreamableHTTPClientTransport(new URL(JIRA_MCP_URL), {
        requestInit: {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      });

      const client = new Client({ name: "jira-dashboard-poc-backend", version: "0.1.0" });
      await client.connect(transport);
      console.log("[Jira MCP] ✅ Connected to Jira MCP server at", JIRA_MCP_URL);

      client.onclose = () => {
        console.warn("[Jira MCP] Connection closed, will reconnect on next call");
        this.client = null;
      };

      this.client = client;
      return client;
    })();

    try {
      return await this.connecting;
    } finally {
      this.connecting = null;
    }
  }

  /**
   * Extracts and JSON-parses the text payload from an MCP tool call result.
   */
  private parseToolResult(result: any): any {
    const textContent = result?.content?.find((c: any) => c.type === "text");
    if (!textContent) {
      throw new Error("[Jira MCP] Tool result did not contain text content");
    }
    if (result?.isError) {
      throw new Error(`[Jira MCP] Tool call failed: ${textContent.text}`);
    }
    try {
      return JSON.parse(textContent.text);
    } catch {
      throw new Error(`[Jira MCP] Tool result was not valid JSON: ${textContent.text}`);
    }
  }

  /**
   * Fetches the REAL list of Jira projects from the MCP server. Called fresh
   * every time (every page load/refresh) — no caching of the result.
   */
  async getAvailableProjects(): Promise<Array<{ key: string; name: string }>> {
    const client = await this.getClient();
    console.log("[Jira MCP] Calling jira_get_all_projects (live)...");

    const result = await client.callTool({
      name: "jira_get_all_projects",
      arguments: { recent: 0, output_format: "json" }
    });

    const parsed = this.parseToolResult(result);
    const projects = parsed.projects ?? parsed.result?.projects ?? [];

    console.log(`[Jira MCP] ✅ Received ${projects.length} real projects from MCP`);
    return projects.map((p: any) => ({ key: p.key, name: p.name }));
  }

  /**
   * Fetches the REAL authenticated Jira user from the MCP server, live.
   */
  async getCurrentUser(): Promise<{ name: string; email: string; displayName: string }> {
    const client = await this.getClient();
    console.log("[Jira MCP] Calling jira_get_current_user (live)...");

    const result = await client.callTool({
      name: "jira_get_current_user",
      arguments: { output_format: "json" }
    });

    const parsed = this.parseToolResult(result);
    const user = parsed.user ?? parsed.result ?? parsed;

    console.log(`[Jira MCP] ✅ Received real user from MCP: ${user.displayName || user.name}`);
    return {
      name: user.name || user.accountId || "Unknown",
      email: user.emailAddress || "",
      displayName: user.displayName || user.name || "Unknown"
    };
  }

  /**
   * Fetches REAL issues for a project within the date range, live from MCP.
   */
  async fetchProjectIssues(projectKey: string, filters: DashboardFilters): Promise<JiraIssue[]> {
    const client = await this.getClient();

    const fromDate = new Date(filters.dateRange.from).toISOString().split("T")[0];
    const toDate = new Date(filters.dateRange.to).toISOString().split("T")[0];
    // jql_filter is combined by the MCP tool as `project = X AND (jql_filter)`,
    // so it must contain only filter conditions — no ORDER BY inside the parens.
    const jqlFilter = `created >= "${fromDate}" AND created <= "${toDate}"`;

    console.log(`[Jira MCP] Calling jira_get_project_issues for ${projectKey} (live)...`);

    const result = await client.callTool({
      name: "jira_get_project_issues",
      arguments: {
        project_key: projectKey,
        jql_filter: jqlFilter,
        limit: 100,
        output_format: "json"
      }
    });

    const parsed = this.parseToolResult(result);
    const issues = parsed.issues ?? parsed.result?.issues ?? [];

    console.log(`[Jira MCP] ✅ Received ${issues.length} real issues for ${projectKey} from MCP`);
    return issues.map((issue: any) => this.mapIssue(issue, projectKey));
  }

  /**
   * Maps the real Jira MCP issue shape (status.category, issue_type.name,
   * resolution_date, assignee) into our internal JiraIssue. status.category
   * is a locale-independent Jira concept ("new" | "indeterminate" | "done"),
   * unlike status.name which is localized (e.g. "Cerrada" in this instance).
   */
  private mapIssue(issue: any, projectKey: string): JiraIssue {
    return {
      key: issue.key,
      projectKey,
      createdAt: issue.created,
      resolvedAt: issue.resolution_date ?? null,
      isDone: issue.status?.category === "done",
      issueTypeName: issue.issue_type?.name ?? "",
      hasAssignee: Boolean(issue.assignee)
    };
  }
}
