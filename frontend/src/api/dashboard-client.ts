import type { DashboardFilters, DashboardResponse } from "@demo/shared";

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class DashboardClient {
  constructor(private readonly fetcher: FetchLike) {}

  async load(filters: DashboardFilters): Promise<DashboardResponse> {
    const response = await this.fetcher("/api/dashboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      return {
        status: "dependency-unavailable",
        message: "Dashboard service returned an unexpected response.",
        fallbackPayload: null
      };
    }

    return (await response.json()) as DashboardResponse;
  }
}
