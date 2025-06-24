import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponAssignRequest,
  CouponAssignResponse,
} from "../../../type/coupon/coupon";

interface CouponAssignState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastAssignedData: CouponAssignResponse | null;
}

const initialState: CouponAssignState = {
  loading: false,
  error: null,
  success: false,
  lastAssignedData: null,
};

const couponAssignSlice = createSlice({
  name: "couponAssign",
  initialState,
  reducers: {
    assignCouponsStart: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<{ storeId: string; assignRequest: CouponAssignRequest }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.lastAssignedData = null;
    },
    assignCouponsSuccess: (
      state,
      action: PayloadAction<CouponAssignResponse>
    ) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.lastAssignedData = action.payload;
    },
    assignCouponsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.lastAssignedData = null;
    },
    resetAssignState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.lastAssignedData = null;
    },
  },
});

export const {
  assignCouponsStart,
  assignCouponsSuccess,
  assignCouponsFailure,
  resetAssignState,
} = couponAssignSlice.actions;
export default couponAssignSlice.reducer; 