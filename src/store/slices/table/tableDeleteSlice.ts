import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TableDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedTableId: string | null;
}

const initialState: TableDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedTableId: null,
};

const tableDeleteSlice = createSlice({
  name: "tableDelete",
  initialState,
  reducers: {
    deleteTableStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedTableId = null;
      },
      prepare: (payload: { tableId: string }) => ({ payload }),
    },
    deleteTableSuccess: (state, action: PayloadAction<{ tableId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedTableId = action.payload.tableId;
      state.error = null;
    },
    deleteTableFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedTableId = null;
    },
    clearDeleteTableState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedTableId = null;
    },
  },
});

export const {
  deleteTableStart,
  deleteTableSuccess,
  deleteTableFailure,
  clearDeleteTableState,
} = tableDeleteSlice.actions;

export default tableDeleteSlice.reducer; 