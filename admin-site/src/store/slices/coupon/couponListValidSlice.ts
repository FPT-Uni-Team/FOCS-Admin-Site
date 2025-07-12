import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponAdminDTO,
  CouponListParams,
} from "../../../type/coupon/coupon";
import type { ListPageParams } from "../../../type/common/common";

interface CouponListState {
  coupons: CouponAdminDTO[];
  loading: boolean;
  error: string | null;
  params: CouponListParams;
  total: number;
}

const initialState: CouponListState = {
  coupons: [],
  loading: false,
  error: null,
  params: {
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  },
  total: 0,
};

const couponListValidSlice = createSlice({
  name: "couponListValid",
  initialState,
  reducers: {
    fetchCouponsValidStart: (
      state,
      action: PayloadAction<{
        params: ListPageParams;
        promotionId?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload.params || initialState.params;
    },
    fetchCouponsValidSuccess: (
      state,
      action: PayloadAction<{
        coupons: CouponAdminDTO[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.coupons = action.payload.coupons;
      state.total = action.payload.total;
      state.error = null;
    },
    fetchCouponsValidFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCouponsValidStart,
  fetchCouponsValidSuccess,
  fetchCouponsValidFailure,
} = couponListValidSlice.actions;
export default couponListValidSlice.reducer;
