import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryListDataType } from "../../../type/category/category";

interface CategoryCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  categorySuccess: CategoryListDataType;
}

const initialState: CategoryCreateState = {
  loading: false,
  success: false,
  error: null,
  categorySuccess: {
    id: "",
    name: "",
    description: "",
    is_active: true,
  },
};

const categoryUpdateSlice = createSlice({
  name: "categoryUpdate",
  initialState,
  reducers: {
    updateCategoryStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload) => ({ payload }),
    },
    updateCategorySuccess: (
      state,
      action: PayloadAction<CategoryListDataType>
    ) => {
      state.loading = false;
      state.success = true;
      state.categorySuccess = action.payload;
    },
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetCategoryUpdate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  resetCategoryUpdate,
} = categoryUpdateSlice.actions;

export default categoryUpdateSlice.reducer;
