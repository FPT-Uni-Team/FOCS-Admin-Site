import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PromotionPayload } from "../../../type/promotion/promotion";

interface PromotionUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PromotionUpdateState = {
  loading: false,
  success: false,
  error: null,
};

const promotionUpdateSlice = createSlice({
  name: "promotionUpdate",
  initialState,
  reducers: {
    updatePromotionStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: PromotionPayload) => ({ payload }),
    },
    updatePromotionSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    updatePromotionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetUpdatePromotion: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updatePromotionStart,
  updatePromotionSuccess,
  updatePromotionFailure,
  resetUpdatePromotion,
} = promotionUpdateSlice.actions;

export default promotionUpdateSlice.reducer;
