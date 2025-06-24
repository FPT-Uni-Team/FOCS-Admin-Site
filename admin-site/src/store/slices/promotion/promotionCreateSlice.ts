import { createSlice } from "@reduxjs/toolkit";

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
    createPromotionStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
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
