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

const categoryCreateSlice = createSlice({
  name: "menuItemCreate",
  initialState,
  reducers: {
    createCategoryStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload) => ({ payload }),
    },
    createCategorySuccess: (
      state,
      action: PayloadAction<CategoryListDataType>
    ) => {
      state.loading = false;
      state.success = true;
      state.categorySuccess = action.payload;
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetCategoryCreate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailure,
  resetCategoryCreate,
} = categoryCreateSlice.actions;

export default categoryCreateSlice.reducer;
