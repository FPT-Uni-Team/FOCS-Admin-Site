import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VariantAssignRequest, VariantAssignResponse } from "../../../type/variant/variant";

interface VariantAssignState {
  loading: boolean;
  success: boolean;
  error: string | null;
  assignResult: VariantAssignResponse | null;
}

const initialState: VariantAssignState = {
  loading: false,
  success: false,
  error: null,
  assignResult: null,
};

const variantAssignSlice = createSlice({
  name: "variantAssign",
  initialState,
  reducers: {
    assignVariantsStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: VariantAssignRequest) => ({ payload }),
    },
    assignVariantsSuccess: (state, action: PayloadAction<VariantAssignResponse>) => {
      state.loading = false;
      state.success = true;
      state.assignResult = action.payload;
    },
    assignVariantsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetVariantAssign: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.assignResult = null;
    },
  },
});

export const {
  assignVariantsStart,
  assignVariantsSuccess,
  assignVariantsFailure,
  resetVariantAssign,
} = variantAssignSlice.actions;

export default variantAssignSlice.reducer;