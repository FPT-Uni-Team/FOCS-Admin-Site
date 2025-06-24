import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TrackCouponUsageResponse } from '../../../type/coupon/coupon';

export interface TrackUsageRequestPayload {
  couponId: string;
  userId?: string;
}

export interface CouponTrackUsageState {
  loading: boolean;
  error: string | null;
  success: boolean;
  usageData: TrackCouponUsageResponse | null;
}

const initialState: CouponTrackUsageState = {
  loading: false,
  error: null,
  success: false,
  usageData: null,
};

const couponTrackUsageSlice = createSlice({
  name: 'couponTrackUsage',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trackUsageRequest: (state, _action: PayloadAction<TrackUsageRequestPayload>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.usageData = null;
    },
    trackUsageSuccess: (state, action: PayloadAction<TrackCouponUsageResponse>) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.usageData = action.payload;
    },
    trackUsageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.usageData = null;
    },
    resetTrackUsageState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.usageData = null;
    },
  },
});

export const {
  trackUsageRequest,
  trackUsageSuccess,
  trackUsageFailure,
  resetTrackUsageState,
} = couponTrackUsageSlice.actions;

export default couponTrackUsageSlice.reducer; 