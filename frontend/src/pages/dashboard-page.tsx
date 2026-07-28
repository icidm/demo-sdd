import { useEffect, useMemo, useState } from "react";
import type { DashboardResponse } from "@demo/shared";
import { DashboardClient } from "../api/dashboard-client";
import { ComparisonPanel } from "../components/comparison-panel";
import { KpiPanels } from "../components/kpi-panels";
import { useFilters } from "../context/filter-context";
import "../styles/dashboard.css";

type Props = {
  client?: DashboardClient;
};

export const DashboardPage = ({ client = new DashboardClient(fetch) }: Props) => {
  const { filters, setFilters } = useFilters();
  const [response, setResponse] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      const next = await client.load(filters);
      if (mounted) {
        setResponse(next);
        setLoading(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [client, filters]);

  const projectValue = useMemo(() => filters.projects.join(","), [filters.projects]);

  return (
    <main className="dashboard-shell">
      <h1>Jira Projects Dashboard</h1>
      <label htmlFor="projects">Projects</label>
      <input
        id="projects"
        value={projectValue}
        onChange={(event) => {
          const projects = event.target.value
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
          setFilters({ ...filters, projects });
        }}
      />

      {loading ? <p>Loading...</p> : null}

      {response?.status === "dependency-unavailable" ? (
        <section role="status">
          <p>Jira MCP unavailable</p>
          {response.fallbackPayload ? <p>Showing snapshot fallback (stale)</p> : null}
        </section>
      ) : null}

      {response?.status === "ok" ? (
        <>
          <p>
            Freshness: {response.payload.freshness.state} ({response.payload.freshness.source})
          </p>
          <KpiPanels projects={response.payload.projects} />
          <ComparisonPanel aggregate={response.payload.aggregate} />
        </>
      ) : null}
    </main>
  );
};
