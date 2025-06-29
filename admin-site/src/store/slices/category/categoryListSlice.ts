import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ListPageParams } from "../../../type/common/common";
import type { CategoryListDataType } from "../../../type/category/category";

interface CategoryListState {
  categories: CategoryListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: CategoryListState = {
  categories: [],
  loading: false,
  error: null,
  params: {
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  },
  total: 0,
};

const categoryListSlice = createSlice({
  name: "categoryList",
  initialState,
  reducers: {
    fetchCategoriesStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchCategoriesSuccess: (
      state,
      action: PayloadAction<{
        categories: CategoryListDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.categories = [];
      state.total = 0;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} = categoryListSlice.actions;
export default categoryListSlice.reducer;
