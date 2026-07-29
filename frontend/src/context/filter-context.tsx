import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DashboardFilters } from "@demo/shared";

type FilterContextState = {
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
};

const initialFilters: DashboardFilters = {
  projects: ["IOP"],
  dateRange: { from: "2026-07-01T00:00:00.000Z", to: "2026-07-31T23:59:59.000Z" }
};

const FilterContext = createContext<FilterContextState | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = (): FilterContextState => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
};
