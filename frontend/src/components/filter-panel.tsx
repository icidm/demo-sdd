import { useEffect, useState } from "react";
import { useFilters } from "../context/filter-context";
import type { DashboardFilters } from "@demo/shared";

type Project = { key: string; name: string };

export const FilterPanel = () => {
  const { filters, setFilters } = useFilters();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        const data = (await response.json()) as { projects: Project[] };
        setProjects(data.projects);
        setError(null);

        // If current selection is not in available projects, reset to first project
        if (
          data.projects.length > 0 &&
          !data.projects.some((p) => p.key === filters.projects[0])
        ) {
          setFilters({
            ...filters,
            projects: [data.projects[0].key]
          });
        }
      } catch (err) {
        console.error("[FilterPanel] Error fetching projects:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback: use default project if fetch fails
        if (filters.projects.length === 0) {
          setFilters({
            ...filters,
            projects: ["IOP"]
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjects = e.target.value ? [e.target.value] : ["IOP"];
    setFilters({
      ...filters,
      projects: newProjects
    });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value).toISOString();
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        from: newDate
      }
    });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value).toISOString();
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        to: newDate
      }
    });
  };

  return (
    <div className="filter-compact">
      <div className="date-range">
        <input
          id="date-from"
          type="date"
          value={new Date(filters.dateRange.from).toISOString().split("T")[0]}
          onChange={handleDateFromChange}
          className="date-input"
          aria-label="From date"
        />
        <span>-</span>
        <input
          id="date-to"
          type="date"
          value={new Date(filters.dateRange.to).toISOString().split("T")[0]}
          onChange={handleDateToChange}
          className="date-input"
          aria-label="To date"
        />
      </div>
      {error && <div className="filter-error">⚠️ {error}</div>}
    </div>
  );
};
