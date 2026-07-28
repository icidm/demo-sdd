import type { AggregateComparison } from "@demo/shared";

export const ComparisonPanel = ({ aggregate }: { aggregate: AggregateComparison }) => {
  return (
    <section aria-label="Aggregate comparison">
      <h3>Comparison</h3>
      <p>Best throughput: {aggregate.bestThroughputProject ?? "N/A"}</p>
      <p>Best cycle time: {aggregate.bestCycleTimeProject ?? "N/A"}</p>
      <p>Best quality: {aggregate.bestQualityProject ?? "N/A"}</p>
    </section>
  );
};
