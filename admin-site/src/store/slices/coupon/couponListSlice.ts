import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponListDataType,
  CouponListParams,
  CouponListResponse,
} from "../../../type/coupon/coupon";

interface CouponListState {
  coupons: CouponListDataType[];
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

const couponSlice = createSlice({
  name: "couponList",
  initialState,
  reducers: {
    fetchCouponsStart: (
      state,
      action: PayloadAction<CouponListParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchCouponsSuccess: (
      state,
      action: PayloadAction<CouponListResponse>
    ) => {
      state.loading = false;
      state.coupons = action.payload.items;
      state.total = action.payload.totalCount;
      state.error = null;
    },
    fetchCouponsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
} = couponSlice.actions;
export default couponSlice.reducer; 