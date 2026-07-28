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

export const KpiPanels = ({ projects }: Props) => {
  return (
    <section aria-label="KPI groups">
      {projects.map((project) => (
        <article key={project.projectKey} data-testid={`kpi-${project.projectKey}`}>
          <h3>{project.projectKey}</h3>
          <p>Throughput: {formatValue(project.flow.throughput.value)}</p>
          <p>Cycle Time: {formatValue(project.flow.cycleTimeDays.value)}</p>
          <p>Commitment: {formatValue(project.predictability.commitmentReliability.value)}</p>
          <p>Defect Rate: {formatValue(project.quality.defectRate.value)}</p>
          {project.partialData ? <p>Partial data</p> : null}
          {project.notes.map((note) => (
            <small key={note}>{note}</small>
          ))}
        </article>
      ))}
    </section>
  );
};
