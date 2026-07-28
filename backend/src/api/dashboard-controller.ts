import type { DashboardFilters, DashboardResponse } from "@demo/shared";
import type { DashboardService } from "../service/dashboard-service";

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  async readDashboard(filters: DashboardFilters): Promise<DashboardResponse> {
    return this.service.getDashboard(filters);
  }
}
