import type { DashboardFilters } from "@demo/shared";

export const validateFilters = (filters: DashboardFilters): string | null => {
  if (filters.projects.length === 0) {
    return "At least one project must be selected.";
  }

  const from = Date.parse(filters.dateRange.from);
  const to = Date.parse(filters.dateRange.to);
  if (Number.isNaN(from) || Number.isNaN(to)) {
    return "Date range must be valid ISO date values.";
  }

  if (from > to) {
    return "Date range start must be earlier than or equal to end.";
  }

  return null;
};
