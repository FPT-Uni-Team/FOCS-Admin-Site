import { createSlice } from "@reduxjs/toolkit";
import type { PromotionPayload } from "../../../type/promotion/promotion";

interface PromotionDetail {
  loading: boolean;
  success: boolean;
  error: string | null;
  promotion: PromotionPayload;
}

const initialState: PromotionDetail = {
  loading: false,
  success: false,
  error: null,
  promotion: {},
};

const promotionDetailSlice = createSlice({
  name: "promotionDetail",
  initialState,
  reducers: {
    fetchPromotionDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchPromotionDetailSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.promotion = action.payload;
    },
    fetchPromotionDetailFailed: (state) => {
      state.loading = false;
      state.success = false;
    },
  },
});

export const {
  fetchPromotionDetailStart,
  fetchPromotionDetailSuccess,
  fetchPromotionDetailFailed,
} = promotionDetailSlice.actions;

export default promotionDetailSlice.reducer;
