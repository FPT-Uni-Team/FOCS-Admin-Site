import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  OrderStatisticResponse,
  OverviewStatisticResponse,
  KitchenStatisticResponse,
  FinanceStatisticResponse,
} from "../../../type/dashboard/dashboard";

interface DashboardState {
  orderStatistic: OrderStatisticResponse | null;
  overviewStatistic: OverviewStatisticResponse | null;
  kitchenStatistic: KitchenStatisticResponse | null;
  financeStatistic: FinanceStatisticResponse | null;
  loading: {
    orderStatistic: boolean;
    overviewStatistic: boolean;
    kitchenStatistic: boolean;
    financeStatistic: boolean;
  };
  error: string | null;
}

const initialState: DashboardState = {
  orderStatistic: null,
  overviewStatistic: null,
  kitchenStatistic: null,
  financeStatistic: null,
  loading: {
    orderStatistic: false,
    overviewStatistic: false,
    kitchenStatistic: false,
    financeStatistic: false,
  },
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchOrderStatisticStart: (state, _action: PayloadAction<{ today?: boolean }>) => {
      state.loading.orderStatistic = true;
      state.error = null;
    },
    fetchOrderStatisticSuccess: (
      state,
      action: PayloadAction<OrderStatisticResponse>
    ) => {
      state.loading.orderStatistic = false;
      state.orderStatistic = action.payload;
      state.error = null;
    },
    fetchOrderStatisticFailure: (state, action: PayloadAction<string>) => {
      state.loading.orderStatistic = false;
      state.error = action.payload;
    },

    fetchOverviewStatisticStart: (state, _action: PayloadAction<{ today?: boolean }>) => {
      state.loading.overviewStatistic = true;
      state.error = null;
    },
    fetchOverviewStatisticSuccess: (
      state,
      action: PayloadAction<OverviewStatisticResponse>
    ) => {
      state.loading.overviewStatistic = false;
      state.overviewStatistic = action.payload;
      state.error = null;
    },
    fetchOverviewStatisticFailure: (state, action: PayloadAction<string>) => {
      state.loading.overviewStatistic = false;
      state.error = action.payload;
    },

    fetchKitchenStatisticStart: (state, _action: PayloadAction<{ today?: boolean }>) => {
      state.loading.kitchenStatistic = true;
      state.error = null;
    },
    fetchKitchenStatisticSuccess: (
      state,
      action: PayloadAction<KitchenStatisticResponse>
    ) => {
      state.loading.kitchenStatistic = false;
      state.kitchenStatistic = action.payload;
      state.error = null;
    },
    fetchKitchenStatisticFailure: (state, action: PayloadAction<string>) => {
      state.loading.kitchenStatistic = false;
      state.error = action.payload;
    },

    fetchFinanceStatisticStart: (state) => {
      state.loading.financeStatistic = true;
      state.error = null;
    },
    fetchFinanceStatisticSuccess: (
      state,
      action: PayloadAction<FinanceStatisticResponse>
    ) => {
      state.loading.financeStatistic = false;
      state.financeStatistic = action.payload;
      state.error = null;
    },
    fetchFinanceStatisticFailure: (state, action: PayloadAction<string>) => {
      state.loading.financeStatistic = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrderStatisticStart,
  fetchOrderStatisticSuccess,
  fetchOrderStatisticFailure,
  fetchOverviewStatisticStart,
  fetchOverviewStatisticSuccess,
  fetchOverviewStatisticFailure,
  fetchKitchenStatisticStart,
  fetchKitchenStatisticSuccess,
  fetchKitchenStatisticFailure,
  fetchFinanceStatisticStart,
  fetchFinanceStatisticSuccess,
  fetchFinanceStatisticFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
