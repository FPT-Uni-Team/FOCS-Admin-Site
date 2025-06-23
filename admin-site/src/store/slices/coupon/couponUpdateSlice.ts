import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CouponUpdateRequest } from "../../../type/coupon/coupon";

interface CouponUpdateState {
  loading: boolean;
  error: string | null;
  success: boolean;
  updatedCoupon: unknown | null;
}

const initialState: CouponUpdateState = {
  loading: false,
  error: null,
  success: false,
  updatedCoupon: null,
};

const couponUpdateSlice = createSlice({
  name: "couponUpdate",
  initialState,
  reducers: {
    updateCouponStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare: (payload: { couponId: string; couponData: CouponUpdateRequest }) => ({ payload }),
    },
    updateCouponSuccess: (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      state.success = true;
      state.updatedCoupon = action.payload;
      state.error = null;
    },
    updateCouponFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    clearUpdateCouponState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updatedCoupon = null;
    },
  },
});

export const {
  updateCouponStart,
  updateCouponSuccess,
  updateCouponFailure,
  clearUpdateCouponState,
} = couponUpdateSlice.actions;
export default couponUpdateSlice.reducer; 