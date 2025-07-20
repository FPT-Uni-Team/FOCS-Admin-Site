import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TableListParams, TableDataType } from "../../../type/table/table";

interface TableListState {
  tables: TableDataType[];
  loading: boolean;
  error: string | null;
  params: TableListParams | null;
  total: number;
}

const initialState: TableListState = {
  tables: [],
  loading: false,
  error: null,
  params: null,
  total: 0,
};

const tableListSlice = createSlice({
  name: "tableList",
  initialState,
  reducers: {
    fetchTablesStart: (
      state,
      action: PayloadAction<TableListParams>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload;
    },
    fetchTablesSuccess: (
      state,
      action: PayloadAction<{
        tables: TableDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.tables = action.payload.tables;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchTablesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.tables = [];
      state.total = 0;
    },
  },
});

export const {
  fetchTablesStart,
  fetchTablesSuccess,
  fetchTablesFailure,
} = tableListSlice.actions;
export default tableListSlice.reducer; 