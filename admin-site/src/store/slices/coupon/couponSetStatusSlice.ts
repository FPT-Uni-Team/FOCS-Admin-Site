import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SetCouponStatusResponse } from '../../../type/coupon/coupon';

// State interface for set coupon status
export interface CouponSetStatusState {
  loading: boolean;
  error: string | null;
  response: SetCouponStatusResponse | null;
  lastUpdatedCouponId: string | null;
}

// Initial state
const initialState: CouponSetStatusState = {
  loading: false,
  error: null,
  response: null,
  lastUpdatedCouponId: null,
};

// Actions payload interfaces
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

// Redux slice
const couponSetStatusSlice = createSlice({
  name: 'couponSetStatus',
  initialState,
  reducers: {
    // Action to initiate set coupon status request
    setCouponStatusRequest: (state, action: PayloadAction<SetCouponStatusRequestPayload>) => {
      state.loading = true;
      state.error = null;
      state.response = null;
      state.lastUpdatedCouponId = action.payload.couponId;
    },

    // Action for successful set coupon status
    setCouponStatusSuccess: (state, action: PayloadAction<SetCouponStatusSuccessPayload>) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload.response;
      state.lastUpdatedCouponId = action.payload.couponId;
    },

    // Action for failed set coupon status
    setCouponStatusFailure: (state, action: PayloadAction<SetCouponStatusFailurePayload>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.response = null;
    },

    // Action to clear set coupon status state
    clearSetCouponStatusState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.lastUpdatedCouponId = null;
    },
  },
});

// Export actions
export const {
  setCouponStatusRequest,
  setCouponStatusSuccess,
  setCouponStatusFailure,
  clearSetCouponStatusState,
} = couponSetStatusSlice.actions;

// Export reducer
export default couponSetStatusSlice.reducer; 