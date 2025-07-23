import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TableCreateRequest, TableDTO } from "../../../type/table/table";

interface TableCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  tableSuccess: TableDTO | null;
}

const initialState: TableCreateState = {
  loading: false,
  success: false,
  error: null,
  tableSuccess: null,
};

const tableCreateSlice = createSlice({
  name: "tableCreate",
  initialState,
  reducers: {
    createTableStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: TableCreateRequest) => ({ payload }),
    },
    createTableSuccess: (state, action: PayloadAction<TableDTO>) => {
      state.loading = false;
      state.success = true;
      state.tableSuccess = action.payload;
      state.error = null;
    },
    createTableFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetTableCreate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.tableSuccess = null;
    },
  },
});

export const {
  createTableStart,
  createTableSuccess,
  createTableFailure,
  resetTableCreate,
} = tableCreateSlice.actions;

export default tableCreateSlice.reducer; 