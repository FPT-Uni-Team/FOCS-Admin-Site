import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Variant } from "../../../type/variant/variant";

interface VariantDetailState {
  variant: Variant | null;
  loading: boolean;
  error: string | null;
}

const initialState: VariantDetailState = {
  variant: null,
  loading: false,
  error: null,
};

const variantDetailSlice = createSlice({
  name: "variantDetail",
  initialState,
  reducers: {
    fetchVariantDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: { variantId: string }) => ({ payload }),
    },
    fetchVariantDetailSuccess: (state, action: PayloadAction<Variant>) => {
      state.loading = false;
      state.variant = action.payload;
      state.error = null;
    },
    fetchVariantDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVariantDetail: (state) => {
      state.variant = null;
      state.error = null;
    },
  },
});

export const {
  fetchVariantDetailStart,
  fetchVariantDetailSuccess,
  fetchVariantDetailFailure,
  clearVariantDetail,
} = variantDetailSlice.actions;
export default variantDetailSlice.reducer;