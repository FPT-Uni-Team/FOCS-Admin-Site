import { createSlice } from "@reduxjs/toolkit";
import type { PromotionPayload } from "../../../type/promotion/promotion";

interface PromotionCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PromotionCreateState = {
  loading: false,
  success: false,
  error: null,
};

const promotionCreateSlice = createSlice({
  name: "promotionCreate",
  initialState,
  reducers: {
    createPromotionStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: PromotionPayload) => ({ payload }),
    },
    createPromotionSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    createPromotionFailure: (state) => {
      state.loading = false;
      state.success = false;
    },
    resetCreatePromotion: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  createPromotionStart,
  createPromotionSuccess,
  createPromotionFailure,
} = promotionCreateSlice.actions;

export default promotionCreateSlice.reducer;
