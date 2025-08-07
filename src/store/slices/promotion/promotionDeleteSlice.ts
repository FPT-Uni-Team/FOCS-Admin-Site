import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PromotionDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedPromotionId: string | null;
}

const initialState: PromotionDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedPromotionId: null,
};

const promotionDeleteSlice = createSlice({
  name: "promotionDelete",
  initialState,
  reducers: {
    deletePromotionStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedPromotionId = null;
      },
      prepare: (payload: { promotionId: string }) => ({ payload }),
    },
    deletePromotionSuccess: (state, action: PayloadAction<{ promotionId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedPromotionId = action.payload.promotionId;
      state.error = null;
    },
    deletePromotionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedPromotionId = null;
    },
    clearDeletePromotionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedPromotionId = null;
    },
  },
});

export const {
  deletePromotionStart,
  deletePromotionSuccess,
  deletePromotionFailure,
  clearDeletePromotionState,
} = promotionDeleteSlice.actions;

export default promotionDeleteSlice.reducer; 