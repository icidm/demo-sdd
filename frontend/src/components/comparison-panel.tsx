import type { AggregateComparison, ProjectKpiGroup } from "@demo/shared";

interface ComparisonPanelProps {
  aggregate: AggregateComparison;
  projects: ProjectKpiGroup[];
}

export const ComparisonPanel = ({ aggregate, projects }: ComparisonPanelProps) => {
  // Helper function to find project data by key
  const getProjectData = (projectKey: string | null) => {
    if (!projectKey) return null;
    return projects.find((p) => p.projectKey === projectKey);
  };

  // Get best project data
  const bestThroughputData = getProjectData(aggregate.bestThroughputProject);
  const bestCycleTimeData = getProjectData(aggregate.bestCycleTimeProject);
  const bestQualityData = getProjectData(aggregate.bestQualityProject);

  // Format value based on unit
  const formatValue = (value: number | null, unit: string): string => {
    if (value === null) return "N/A";
    if (unit === "ratio") return `${(value * 100).toFixed(1)}%`;
    if (unit === "count") return value.toString();
    if (unit === "days") return `${value.toFixed(0)}d`;
    return value.toString();
  };

  return (
    <section className="comparison-panel" aria-label="Aggregate comparison">
      <h3>Performance Comparison</h3>
      
      <div className="comparison-metrics">
        {/* Throughput Chart */}
        <div className="comparison-chart">
          <h4>Throughput</h4>
          <svg viewBox="0 0 200 120" className="chart-svg">
            {/* Grid */}
            <line x1="30" y1="20" x2="30" y2="100" stroke="#ccc" strokeWidth="1" />
            <line x1="30" y1="100" x2="190" y2="100" stroke="#ccc" strokeWidth="1" />
            
            {/* Dynamic bar based on value */}
            {bestThroughputData?.flow.completedIssues.value ? (
              <rect x="40" y={60 - (bestThroughputData.flow.completedIssues.value * 2)} width="20" height={bestThroughputData.flow.completedIssues.value * 2} fill="#000" />
            ) : (
              <rect x="40" y="60" width="20" height="40" fill="#e5e5e5" />
            )}
            <text x="55" y="115" fontSize="10" textAnchor="start">{aggregate.bestThroughputProject || "N/A"}</text>
            
            {/* Y-axis labels */}
            <text x="25" y="105" fontSize="8" textAnchor="end">0</text>
            <text x="25" y="50" fontSize="8" textAnchor="end">50</text>
          </svg>
          <div className="chart-value">
            {bestThroughputData ? formatValue(bestThroughputData.flow.completedIssues.value, bestThroughputData.flow.completedIssues.unit) : "N/A"}
          </div>
        </div>

        {/* Cycle Time Chart */}
        <div className="comparison-chart">
          <h4>Cycle Time</h4>
          <svg viewBox="0 0 200 120" className="chart-svg">
            {/* Grid */}
            <line x1="30" y1="20" x2="30" y2="100" stroke="#ccc" strokeWidth="1" />
            <line x1="30" y1="100" x2="190" y2="100" stroke="#ccc" strokeWidth="1" />
            
            {/* Dynamic bar based on value */}
            {bestCycleTimeData?.flow.cycleTimeDays.value ? (
              <rect x="40" y={70 - (bestCycleTimeData.flow.cycleTimeDays.value * 3)} width="20" height={bestCycleTimeData.flow.cycleTimeDays.value * 3} fill="#000" />
            ) : (
              <rect x="40" y="70" width="20" height="30" fill="#e5e5e5" />
            )}
            <text x="55" y="115" fontSize="10" textAnchor="start">{aggregate.bestCycleTimeProject || "N/A"}</text>
            
            {/* Y-axis labels */}
            <text x="25" y="105" fontSize="8" textAnchor="end">0</text>
            <text x="25" y="50" fontSize="8" textAnchor="end">50d</text>
          </svg>
          <div className="chart-value">
            {bestCycleTimeData ? formatValue(bestCycleTimeData.flow.cycleTimeDays.value, bestCycleTimeData.flow.cycleTimeDays.unit) : "N/A"}
          </div>
        </div>

        {/* Quality Chart */}
        <div className="comparison-chart">
          <h4>Quality (Defect Rate)</h4>
          <svg viewBox="0 0 200 120" className="chart-svg">
            {/* Grid */}
            <line x1="30" y1="20" x2="30" y2="100" stroke="#ccc" strokeWidth="1" />
            <line x1="30" y1="100" x2="190" y2="100" stroke="#ccc" strokeWidth="1" />
            
            {/* Dynamic bar height reflects reliability (1 - defect rate), so a taller bar always means better quality */}
            {bestQualityData?.quality.defectRate.value !== undefined && bestQualityData?.quality.defectRate.value !== null ? (
              <rect x="40" y={50 - ((1 - bestQualityData.quality.defectRate.value) * 50)} width="20" height={(1 - bestQualityData.quality.defectRate.value) * 50} fill="#000" />
            ) : (
              <rect x="40" y="50" width="20" height="50" fill="#e5e5e5" />
            )}
            <text x="55" y="115" fontSize="10" textAnchor="start">{aggregate.bestQualityProject || "N/A"}</text>
            
            {/* Y-axis labels */}
            <text x="25" y="105" fontSize="8" textAnchor="end">0</text>
            <text x="25" y="50" fontSize="8" textAnchor="end">100%</text>
          </svg>
          <div className="chart-value">
            {bestQualityData ? formatValue(bestQualityData.quality.defectRate.value, "ratio") : "N/A"}
          </div>
        </div>
      </div>
    </section>
  );
};
