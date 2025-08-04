import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultParams,
  type ListPageParams,
} from "../../../type/common/common";
import type { VariantGroup } from "../../../type/variant/variant";

interface VariantGroupListState {
  variantGroupsList: VariantGroup[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: VariantGroupListState = {
  variantGroupsList: [],
  loading: false,
  error: null,
  params: defaultParams(),
  total: 0,
};

const variantGroupSlice = createSlice({
  name: "variantGroupList",
  initialState,
  reducers: {
    fetchVariantGroupsStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchVariantGroupsSuccess: (
      state,
      action: PayloadAction<{
        variantGroups: VariantGroup[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.variantGroupsList = action.payload.variantGroups;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchVariantGroupsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.variantGroupsList = [];
      state.total = 0;
    },
  },
});

export const {
  fetchVariantGroupsStart,
  fetchVariantGroupsSuccess,
  fetchVariantGroupsFailure,
} = variantGroupSlice.actions;
export default variantGroupSlice.reducer;
