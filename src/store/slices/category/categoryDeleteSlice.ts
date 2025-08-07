import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedCategoryId: string | null;
}

const initialState: CategoryDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedCategoryId: null,
};

const categoryDeleteSlice = createSlice({
  name: "categoryDelete",
  initialState,
  reducers: {
    deleteCategoryStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedCategoryId = null;
      },
      prepare: (payload: { categoryId: string }) => ({ payload }),
    },
    deleteCategorySuccess: (state, action: PayloadAction<{ categoryId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedCategoryId = action.payload.categoryId;
      state.error = null;
    },
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedCategoryId = null;
    },
    clearDeleteCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedCategoryId = null;
    },
  },
});

export const {
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  clearDeleteCategoryState,
} = categoryDeleteSlice.actions;

export default categoryDeleteSlice.reducer; 