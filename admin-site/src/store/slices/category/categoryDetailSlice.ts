import { createSlice } from "@reduxjs/toolkit";
import type { CategoryListDataType } from "../../../type/category/category";

interface CategoryDetail {
  loading: boolean;
  success: boolean;
  error: string | null;
  category: CategoryListDataType;
}

const initialState: CategoryDetail = {
  loading: false,
  success: false,
  error: null,
  category: {
    id: "",
    name: "",
    description: "",
    is_active: true,
  },
};

const categoryDetailSlice = createSlice({
  name: "categoryDetail",
  initialState,
  reducers: {
    fetchCategoryDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchCategoryDetailSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.category = action.payload;
    },
    fetchCategoryDetailFailed: (state) => {
      state.loading = false;
      state.success = false;
    },
  },
});

export const {
  fetchCategoryDetailStart,
  fetchCategoryDetailSuccess,
  fetchCategoryDetailFailed,
} = categoryDetailSlice.actions;

export default categoryDetailSlice.reducer;
