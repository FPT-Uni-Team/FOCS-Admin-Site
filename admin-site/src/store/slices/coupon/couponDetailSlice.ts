import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CouponDetailType } from "../../../type/coupon/coupon";

interface CouponDetailState {
  coupon: CouponDetailType | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponDetailState = {
  coupon: null,
  loading: false,
  error: null,
};

const couponDetailSlice = createSlice({
  name: "couponDetail",
  initialState,
  reducers: {
    fetchCouponDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: { storeId: string; couponId: string }) => ({ payload }),
    },
    fetchCouponDetailSuccess: (state, action: PayloadAction<CouponDetailType>) => {
      state.loading = false;
      state.coupon = action.payload;
      state.error = null;
    },
    fetchCouponDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCouponDetail: (state) => {
      state.coupon = null;
      state.error = null;
    },
  },
});

export const {
  fetchCouponDetailStart,
  fetchCouponDetailSuccess,
  fetchCouponDetailFailure,
  clearCouponDetail,
} = couponDetailSlice.actions;
export default couponDetailSlice.reducer; 