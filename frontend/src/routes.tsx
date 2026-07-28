import { FilterProvider } from "./context/filter-context";
import { DashboardPage } from "./pages/dashboard-page";

export const dashboardRoute = {
  path: "/dashboard",
  element: (
    <FilterProvider>
      <DashboardPage />
    </FilterProvider>
  )
};
