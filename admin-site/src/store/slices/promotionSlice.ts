import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Promotion {
  id: number;
  name: string;
  email: string;
}

interface PromotionState {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

const initialState: PromotionState = {
  promotions: [],
  loading: false,
  error: null,
};

const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    fetchPromotionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPromotionsSuccess: (state, action: PayloadAction<Promotion[]>) => {
      state.loading = false;
      state.promotions = action.payload;
    },
    fetchPromotionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPromotionsStart,
  fetchPromotionsSuccess,
  fetchPromotionsFailure,
} = promotionSlice.actions;
export default promotionSlice.reducer;
