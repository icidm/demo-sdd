import type { ProjectKpiGroup } from "@demo/shared";

type Props = {
  projects: ProjectKpiGroup[];
};

const formatValue = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const formatPercentage = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }
  return `${(value * 100).toFixed(1)}%`;
};

const getKpiStatus = (value: number | null, thresholds?: { warning?: number; error?: number }): "success" | "warning" | "error" => {
  if (value === null) return "error";
  if (thresholds?.error !== undefined && value <= thresholds.error) return "error";
  if (thresholds?.warning !== undefined && value <= thresholds.warning) return "warning";
  return "success";
};

export const KpiPanels = ({ projects }: Props) => {
  return (
    <section aria-label="KPI groups">
      {projects.map((project) => (
        <article key={project.projectKey} data-testid={`kpi-${project.projectKey}`}>
          <h3>{project.projectKey}</h3>
          
          <div className="kpi-metrics-grid">
            <div className="kpi-metric">
              <strong>Total Issues</strong>
              <span className="kpi-value">{formatValue(project.flow.totalIssues.value)}</span>
              <span className="kpi-unit">{project.flow.totalIssues.unit}</span>
            </div>

            <div className="kpi-metric">
              <strong>Completed Issues</strong>
              <span className="kpi-value">{formatValue(project.flow.completedIssues.value)}</span>
              <span className="kpi-unit">{project.flow.completedIssues.unit}</span>
            </div>

            <div className="kpi-metric">
              <strong>Cycle Time</strong>
              <span className="kpi-value">{formatValue(project.flow.cycleTimeDays.value)}</span>
              <span className="kpi-unit">{project.flow.cycleTimeDays.unit}</span>
            </div>

            <div className="kpi-metric">
              <strong>Completion Rate</strong>
              <span className="kpi-value">{formatPercentage(project.backlogHealth.completionRate.value)}</span>
            </div>

            <div className="kpi-metric">
              <strong>Avg. Open Age</strong>
              <span className="kpi-value">{formatValue(project.backlogHealth.avgOpenAgeDays.value)}</span>
              <span className="kpi-unit">{project.backlogHealth.avgOpenAgeDays.unit}</span>
            </div>

            <div className="kpi-metric">
              <strong>Defect Rate</strong>
              <span className="kpi-value">{formatPercentage(project.quality.defectRate.value)}</span>
            </div>

            <div className="kpi-metric">
              <strong>Unassigned Rate</strong>
              <span className="kpi-value">{formatPercentage(project.quality.unassignedRate.value)}</span>
            </div>
          </div>

          {project.partialData && (
            <div className="kpi-warning">
              ⚠️ Partial data - Some issues may be missing
            </div>
          )}

          {project.notes.length > 0 && (
            <div className="kpi-notes">
              {project.notes.map((note) => (
                <div key={note} className="kpi-note">{note}</div>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
};
