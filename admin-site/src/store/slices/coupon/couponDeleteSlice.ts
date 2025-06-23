import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CouponDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedCouponId: string | null;
}

const initialState: CouponDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedCouponId: null,
};

const couponDeleteSlice = createSlice({
  name: "couponDelete",
  initialState,
  reducers: {
    deleteCouponStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedCouponId = null;
      },
      prepare: (payload: { couponId: string }) => ({ payload }),
    },
    deleteCouponSuccess: (state, action: PayloadAction<{ couponId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedCouponId = action.payload.couponId;
      state.error = null;
    },
    deleteCouponFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedCouponId = null;
    },
    clearDeleteCouponState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedCouponId = null;
    },
  },
});

export const {
  deleteCouponStart,
  deleteCouponSuccess,
  deleteCouponFailure,
  clearDeleteCouponState,
} = couponDeleteSlice.actions;
export default couponDeleteSlice.reducer;