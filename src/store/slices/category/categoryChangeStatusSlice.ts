import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChangeCategoryStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ChangeCategoryStatusState = {
  loading: false,
  error: null,
  success: false,
};

const changeCategoryStatusSlice = createSlice({
  name: "changeCategoryStatus",
  initialState,
  reducers: {
    changeCategoryStatusStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare: (actionType: string, categoryId: string) => ({
        payload: {
          actionType,
          categoryId,
        },
      }),
    },
    changeCategoryStatusSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    changeCategoryStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
  changeCategoryStatusStart,
  changeCategoryStatusSuccess,
  changeCategoryStatusFailure,
} = changeCategoryStatusSlice.actions;

export default changeCategoryStatusSlice.reducer;
