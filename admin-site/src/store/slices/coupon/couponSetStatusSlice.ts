import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SetCouponStatusResponse } from "../../../type/coupon/coupon";

export interface CouponSetStatusState {
  loading: boolean;
  error: string | null;
  response: SetCouponStatusResponse | null;
  lastUpdatedCouponId: string | null;
  success: boolean;
}

const initialState: CouponSetStatusState = {
  loading: false,
  error: null,
  response: null,
  success: false,
  lastUpdatedCouponId: null,
};

export interface SetCouponStatusRequestPayload {
  couponId: string;
  isActive: boolean;
}

export interface SetCouponStatusSuccessPayload {
  response: SetCouponStatusResponse;
  couponId: string;
}

export interface SetCouponStatusFailurePayload {
  error: string;
}

const couponSetStatusSlice = createSlice({
  name: "couponSetStatus",
  initialState,
  reducers: {
    setCouponStatusRequest: (
      state,
      action: PayloadAction<SetCouponStatusRequestPayload>
    ) => {
      state.loading = true;
      state.error = null;
      state.response = null;
      state.lastUpdatedCouponId = action.payload.couponId;
      state.success = false;
    },

    setCouponStatusSuccess: (
      state,
      action: PayloadAction<SetCouponStatusSuccessPayload>
    ) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload.response;
      state.lastUpdatedCouponId = action.payload.couponId;
      state.success = true;
    },

    setCouponStatusFailure: (
      state,
      action: PayloadAction<SetCouponStatusFailurePayload>
    ) => {
      state.loading = false;
      state.error = action.payload.error;
      state.response = null;
      state.success = false;
    },

    clearSetCouponStatusState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.lastUpdatedCouponId = null;
      state.success = false;
    },
  },
});

export const {
  setCouponStatusRequest,
  setCouponStatusSuccess,
  setCouponStatusFailure,
  clearSetCouponStatusState,
} = couponSetStatusSlice.actions;

export default couponSetStatusSlice.reducer;
