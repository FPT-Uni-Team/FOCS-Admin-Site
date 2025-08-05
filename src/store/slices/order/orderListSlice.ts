import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderListDataType } from "../../../type/order/order";
import type { ListPageParams } from "../../../type/common/common";
import { defaultParams } from "../../../type/common/common";

interface OrderListState {
  orders: OrderListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: OrderListState = {
  orders: [],
  loading: false,
  error: null,
  params: defaultParams(),
  total: 0,
};

const orderListSlice = createSlice({
  name: "orderList",
  initialState,
  reducers: {
    fetchOrdersStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchOrdersSuccess: (
      state,
      action: PayloadAction<{
        orders: OrderListDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.orders = [];
      state.total = 0;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
} = orderListSlice.actions;
export default orderListSlice.reducer;