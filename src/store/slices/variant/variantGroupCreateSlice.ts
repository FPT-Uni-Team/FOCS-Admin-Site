import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VariantGroupCreateRequest } from "../../../type/variant/variant";

interface VariantGroupCreateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: VariantGroupCreateState = {
  loading: false,
  error: null,
  success: false,
};

const variantGroupCreateSlice = createSlice({
  name: "variantGroupCreate",
  initialState,
  reducers: {
    createVariantGroupStart: (
      state,
      _action: PayloadAction<VariantGroupCreateRequest>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createVariantGroupSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    createVariantGroupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetVariantGroupCreate: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  createVariantGroupStart,
  createVariantGroupSuccess,
  createVariantGroupFailure,
  resetVariantGroupCreate,
} = variantGroupCreateSlice.actions;
export default variantGroupCreateSlice.reducer; 