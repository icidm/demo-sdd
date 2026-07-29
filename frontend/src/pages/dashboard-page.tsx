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

export const DashboardPage = ({ client }: Props) => {
  const { filters } = useFilters();
  const [response, setResponse] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Create client inside useMemo to avoid recreation on every render
  const memoizedClient = useMemo(() => {
    return client || new DashboardClient((url, init) => fetch(url, init));
  }, [client]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      const next = await memoizedClient.load(filters);
      if (mounted) {
        setResponse(next);
        setLoading(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [memoizedClient, filters]);

  return (
    <div className="dashboard-shell">
      {loading ? <p>Loading...</p> : null}

      {response?.status === "dependency-unavailable" ? (
        <section role="status" style={{ padding: '1rem', border: '1px solid var(--ids-color-border)', borderRadius: 'var(--ids-border-radius-lg)', marginBottom: '2rem', backgroundColor: 'var(--ids-color-bg-warning)' }}>
          <p>Jira MCP unavailable</p>
          <p>{response.message}</p>
        </section>
      ) : null}

      {response?.status === "ok" ? (
        <>
          <KpiPanels projects={response.payload.projects} />
          <ComparisonPanel aggregate={response.payload.aggregate} projects={response.payload.projects} />
        </>
      ) : null}
    </div>
  );
};

export default DashboardPage;
