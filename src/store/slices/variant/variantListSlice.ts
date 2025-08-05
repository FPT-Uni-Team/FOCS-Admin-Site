import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Variant } from "../../../type/variant/variant";
import type { ListPageResponse } from "../../../type/common/common";

interface VariantListState {
  variants: Variant[];
  loading: boolean;
  total: number;
  error?: string;
}

const initialState: VariantListState = {
  variants: [],
  loading: false,
  total: 0,
  error: undefined,
};

const variantListSlice = createSlice({
  name: "variantList",
  initialState,
  reducers: {
    fetchVariantsStart: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = undefined;
    },
    fetchVariantsSuccess: (state, action: PayloadAction<ListPageResponse>) => {
      state.loading = false;
      state.variants = action.payload.items as Variant[];
      state.total = action.payload.total_count;
      state.error = undefined;
    },
    fetchVariantsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVariants: (state) => {
      state.variants = [];
      state.total = 0;
      state.error = undefined;
    },
  },
});

export const {
  fetchVariantsStart,
  fetchVariantsSuccess,
  fetchVariantsFailure,
  clearVariants,
} = variantListSlice.actions;

export default variantListSlice.reducer;