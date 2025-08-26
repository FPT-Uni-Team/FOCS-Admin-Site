import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { DashboardParams } from "../type/dashboard/dashboard";

const dashboardService = {
  getOrderStatistic: (params: DashboardParams) =>
    axiosClient.post(endpoints.dashboard.orderStatistic(), params),
  getOverviewStatistic: (params: DashboardParams) =>
    axiosClient.post(endpoints.dashboard.overview(), params),
  getKitchenStatistic: (params: DashboardParams) =>
    axiosClient.post(endpoints.dashboard.kitchenStatistic(), params),
  getFinanceStatistic: () =>
    axiosClient.post(endpoints.dashboard.financeStatistic(), {}),
};

export default dashboardService;
