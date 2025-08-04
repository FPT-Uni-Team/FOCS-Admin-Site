import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VariantGroup } from "../../../type/variant/variant";

interface VariantGroupDetailState {
  variantGroupDetail: VariantGroup | null;
  loading: boolean;
  error: string | null;
}

const initialState: VariantGroupDetailState = {
  variantGroupDetail: null,
  loading: false,
  error: null,
};

const variantGroupDetailSlice = createSlice({
  name: "variantGroupDetail",
  initialState,
  reducers: {
    fetchVariantGroupDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchVariantGroupDetailSuccess: (
      state,
      action: PayloadAction<VariantGroup>
    ) => {
      state.loading = false;
      state.variantGroupDetail = action.payload;
      state.error = null;
    },
    fetchVariantGroupDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.variantGroupDetail = null;
    },
    clearVariantGroupDetail: (state) => {
      state.variantGroupDetail = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  fetchVariantGroupDetailStart,
  fetchVariantGroupDetailSuccess,
  fetchVariantGroupDetailFailure,
  clearVariantGroupDetail,
} = variantGroupDetailSlice.actions;

export default variantGroupDetailSlice.reducer;