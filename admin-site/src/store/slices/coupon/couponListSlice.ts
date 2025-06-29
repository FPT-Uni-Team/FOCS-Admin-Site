import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponAdminDTO,
  CouponListParams,
} from "../../../type/coupon/coupon";
import type { ListPageResponse } from "../../../type/common/common";

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
    fetchCouponsSuccess: (state, action: PayloadAction<ListPageResponse>) => {
      state.loading = false;
      state.coupons = action.payload.items;
      state.total = action.payload.total_count;
      state.error = null;
    },
    fetchCouponsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNewCouponToList: (state, action: PayloadAction<CouponAdminDTO>) => {
      state.coupons.unshift(action.payload);
      state.total += 1;
    },
  },
});

export const {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  addNewCouponToList,
} = couponSlice.actions;
export default couponSlice.reducer;
