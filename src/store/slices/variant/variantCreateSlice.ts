import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Variant } from "../../../type/variant/variant";

interface VariantCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  variantSuccess: Variant | null;
}

const initialState: VariantCreateState = {
  loading: false,
  success: false,
  error: null,
  variantSuccess: null,
};

const variantCreateSlice = createSlice({
  name: "variantCreate",
  initialState,
  reducers: {
    createVariantStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload) => ({ payload }),
    },
    createVariantSuccess: (
      state,
      action: PayloadAction<Variant>
    ) => {
      state.loading = false;
      state.success = true;
      state.variantSuccess = action.payload;
    },
    createVariantFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetVariantCreate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.variantSuccess = null;
    },
  },
});

export const {
  createVariantStart,
  createVariantSuccess,
  createVariantFailure,
  resetVariantCreate,
} = variantCreateSlice.actions;

export default variantCreateSlice.reducer;