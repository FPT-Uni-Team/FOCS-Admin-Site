import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderDTO } from "../../../type/order/order";

interface OrderDetailState {
  order: OrderDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderDetailState = {
  order: null,
  loading: false,
  error: null,
};

const orderDetailSlice = createSlice({
  name: "orderDetail",
  initialState,
  reducers: {
    fetchOrderDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: { orderCode: string }) => ({ payload }),
    },
    fetchOrderDetailSuccess: (state, action: PayloadAction<OrderDTO>) => {
      state.loading = false;
      state.order = action.payload;
      state.error = null;
    },
    fetchOrderDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderDetail: (state) => {
      state.order = null;
      state.error = null;
    },
  },
});

export const {
  fetchOrderDetailStart,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailure,
  clearOrderDetail,
} = orderDetailSlice.actions;
export default orderDetailSlice.reducer;