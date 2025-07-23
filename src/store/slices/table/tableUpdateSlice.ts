import { createSlice } from "@reduxjs/toolkit";
import type { TableDTO } from "../../../type/table/table";

interface TableUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: TableUpdateState = {
  loading: false,
  success: false,
  error: null,
};

const tableUpdateSlice = createSlice({
  name: "tableUpdate",
  initialState,
  reducers: {
    updateTableStart: {
      reducer(state) {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare(payload: { id: string; data: Partial<TableDTO> }) {
        return { payload };
      },
    },
    updateTableSuccess(state) {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    updateTableFailure(state, action) {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetTableUpdate(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateTableStart,
  updateTableSuccess,
  updateTableFailure,
  resetTableUpdate,
} = tableUpdateSlice.actions;

export default tableUpdateSlice.reducer; 