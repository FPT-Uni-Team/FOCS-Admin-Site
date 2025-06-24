import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponAdminDTO,
  CouponListParams,
  CouponListResponse,
} from "../../../type/coupon/coupon";

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
    fetchCouponsSuccess: (state, action: PayloadAction<CouponListResponse>) => {
      state.loading = false;
      const newCoupons = action.payload.items.map((item) => ({
        ...item,
        status: item.status !== undefined ? item.status : 2,
      }));

      const existingTempIds = state.coupons
        .filter((c) => c.id.startsWith("temp-"))
        .map((c) => c.id);
      const filteredCoupons = newCoupons.filter(
        (apiCoupon) =>
          !existingTempIds.some((tempId) => {
            const existingCoupon = state.coupons.find((c) => c.id === tempId);
            return (
              existingCoupon &&
              existingCoupon.code === apiCoupon.code &&
              existingCoupon.description === apiCoupon.description
            );
          })
      );

      state.coupons = filteredCoupons;
      state.total = action.payload.totalCount;
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
