import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TableDataType } from "../../../type/table/table";

interface TableDetailState {
  table: TableDataType;
  loading: boolean;
  error: string | null;
}

const initialState: TableDetailState = {
  table: {} as TableDataType,
  loading: false,
  error: null,
};

const tableDetailSlice = createSlice({
  name: "tableDetail",
  initialState,
  reducers: {
    fetchTableDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchTableDetailSuccess: (state, action: PayloadAction<TableDataType>) => {
      state.loading = false;
      state.table = action.payload;
      state.error = null;
    },
    fetchTableDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.table = {} as TableDataType;
    },
  },
});

export const {
  fetchTableDetailStart,
  fetchTableDetailSuccess,
  fetchTableDetailFailure,
} = tableDetailSlice.actions;

export default tableDetailSlice.reducer; 