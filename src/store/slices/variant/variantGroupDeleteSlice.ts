import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VariantGroupDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedVariantGroupId: string | null;
}

const initialState: VariantGroupDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedVariantGroupId: null,
};

const variantGroupDeleteSlice = createSlice({
  name: "variantGroupDelete",
  initialState,
  reducers: {
    deleteVariantGroupStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedVariantGroupId = null;
      },
      prepare: (payload: { variantGroupId: string }) => ({ payload }),
    },
    deleteVariantGroupSuccess: (state, action: PayloadAction<{ variantGroupId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedVariantGroupId = action.payload.variantGroupId;
      state.error = null;
    },
    deleteVariantGroupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedVariantGroupId = null;
    },
    clearDeleteVariantGroupState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedVariantGroupId = null;
    },
  },
});

export const {
  deleteVariantGroupStart,
  deleteVariantGroupSuccess,
  deleteVariantGroupFailure,
  clearDeleteVariantGroupState,
} = variantGroupDeleteSlice.actions;

export default variantGroupDeleteSlice.reducer; 