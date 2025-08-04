import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VariantGroupUpdateRequest } from "../../../type/variant/variant";

interface VariantGroupUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  variantGroupSuccess: VariantGroupUpdateRequest | null;
}

const initialState: VariantGroupUpdateState = {
  loading: false,
  success: false,
  error: null,
  variantGroupSuccess: null,
};

const variantGroupUpdateSlice = createSlice({
  name: "variantGroupUpdate",
  initialState,
  reducers: {
    updateVariantGroupStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: { id: string; payload: VariantGroupUpdateRequest }) => ({ payload }),
    },
    updateVariantGroupSuccess: (state, action: PayloadAction<VariantGroupUpdateRequest>) => {
      state.loading = false;
      state.success = true;
      state.variantGroupSuccess = action.payload;
    },
    updateVariantGroupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetVariantGroupUpdate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.variantGroupSuccess = null;
    },
  },
});

export const {
  updateVariantGroupStart,
  updateVariantGroupSuccess,
  updateVariantGroupFailure,
  resetVariantGroupUpdate,
} = variantGroupUpdateSlice.actions;

export default variantGroupUpdateSlice.reducer;