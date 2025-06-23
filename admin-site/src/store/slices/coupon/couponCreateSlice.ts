import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CouponCreateRequest } from "../../../type/coupon/coupon";

interface CouponCreateState {
  loading: boolean;
  error: string | null;
  success: boolean;
  createdCoupon: Record<string, unknown> | null;
}

const initialState: CouponCreateState = {
  loading: false,
  error: null,
  success: false,
  createdCoupon: null,
};

interface CreateCouponPayload {
  couponData: CouponCreateRequest;
  storeId: string;
}

const couponCreateSlice = createSlice({
  name: "couponCreate",
  initialState,
  reducers: {
    createCouponStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.createdCoupon = null;
      },
      prepare: (payload: CreateCouponPayload) => ({ payload }),
    },
    createCouponSuccess: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.loading = false;
      state.success = true;
      state.createdCoupon = action.payload;
      state.error = null;
    },
    createCouponFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.createdCoupon = null;
    },
    resetCreateCoupon: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.createdCoupon = null;
    },
  },
});

export const {
  createCouponStart,
  createCouponSuccess,
  createCouponFailure,
  resetCreateCoupon,
} = couponCreateSlice.actions;

export default couponCreateSlice.reducer; 