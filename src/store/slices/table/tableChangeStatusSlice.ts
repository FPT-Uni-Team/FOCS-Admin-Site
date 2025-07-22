import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChangeTableStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ChangeTableStatusState = {
  loading: false,
  error: null,
  success: false,
};

const changeTableStatusSlice = createSlice({
  name: "changeTableStatus",
  initialState,
  reducers: {
    changeTableStatusStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare: (tableId: string, storeId: string, status: number) => ({
        payload: {
          tableId,
          storeId,
          status,
        },
      }),
    },
    changeTableStatusSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    changeTableStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetChangeTableStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  changeTableStatusStart,
  changeTableStatusSuccess,
  changeTableStatusFailure,
  resetChangeTableStatus,
} = changeTableStatusSlice.actions;

export default changeTableStatusSlice.reducer; 