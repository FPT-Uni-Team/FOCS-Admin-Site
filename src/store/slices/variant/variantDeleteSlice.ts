import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VariantDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedVariantId: string | null;
}

const initialState: VariantDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedVariantId: null,
};

const variantDeleteSlice = createSlice({
  name: "variantDelete",
  initialState,
  reducers: {
    deleteVariantStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedVariantId = null;
      },
      prepare: (payload: { variantId: string }) => ({ payload }),
    },
    deleteVariantSuccess: (state, action: PayloadAction<{ variantId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedVariantId = action.payload.variantId;
      state.error = null;
    },
    deleteVariantFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedVariantId = null;
    },
    clearDeleteVariantState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedVariantId = null;
    },
  },
});

export const {
  deleteVariantStart,
  deleteVariantSuccess,
  deleteVariantFailure,
  clearDeleteVariantState,
} = variantDeleteSlice.actions;

export default variantDeleteSlice.reducer; 