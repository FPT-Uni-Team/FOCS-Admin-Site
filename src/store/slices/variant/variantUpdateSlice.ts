import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VariantUpdateRequest } from "../../../type/variant/variant";

interface VariantUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  variantSuccess: VariantUpdateRequest;
}

const initialState: VariantUpdateState = {
  loading: false,
  success: false,
  error: null,
  variantSuccess: {
    name: "",
    price: 0,
    is_available: true,
    prep_per_time: undefined,
    quantity_per_time: undefined,
  },
};

const variantUpdateSlice = createSlice({
  name: "variantUpdate",
  initialState,
  reducers: {
    updateVariantStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload) => ({ payload }),
    },
    updateVariantSuccess: (state, action: PayloadAction<VariantUpdateRequest>) => {
      state.loading = false;
      state.success = true;
      state.variantSuccess = action.payload;
    },
    updateVariantFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetVariantUpdate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateVariantStart,
  updateVariantSuccess,
  updateVariantFailure,
  resetVariantUpdate,
} = variantUpdateSlice.actions;

export default variantUpdateSlice.reducer;