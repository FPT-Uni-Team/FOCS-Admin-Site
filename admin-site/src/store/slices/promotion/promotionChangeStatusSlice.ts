import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface changeStatusPromotionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: changeStatusPromotionState = {
  loading: false,
  error: null,
  success: false,
};

const changeStatusPromotionSlice = createSlice({
  name: "changeStatusPromotion",
  initialState,
  reducers: {
    changeStatusPromotionsStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare: (category: string, promotionId: string) => ({
        payload: {
          category,
          promotionId,
        },
      }),
    },
    changeStatusPromotionsSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    changeStatusPromotionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
  changeStatusPromotionsStart,
  changeStatusPromotionsSuccess,
  changeStatusPromotionsFailure,
} = changeStatusPromotionSlice.actions;
export default changeStatusPromotionSlice.reducer;
