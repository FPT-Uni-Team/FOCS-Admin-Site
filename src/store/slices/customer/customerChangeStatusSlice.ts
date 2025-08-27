import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChangeCustomerStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ChangeCustomerStatusState = {
  loading: false,
  error: null,
  success: false,
};

const changeCustomerStatusSlice = createSlice({
  name: "changeCustomerStatus",
  initialState,
  reducers: {
    changeCustomerStatusStart: {
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
    changeCustomerStatusSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    changeCustomerStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
  changeCustomerStatusStart,
  changeCustomerStatusSuccess,
  changeCustomerStatusFailure,
} = changeCustomerStatusSlice.actions;

export default changeCustomerStatusSlice.reducer;
