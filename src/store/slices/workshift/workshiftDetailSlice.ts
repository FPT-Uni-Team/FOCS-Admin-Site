import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkshiftDetailResponseActual } from "../../../type/workshift/workshift";

interface WorkshiftDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  workshiftDetail: WorkshiftDetailResponseActual | null;
}

const initialState: WorkshiftDetailState = {
  loading: false,
  success: false,
  error: null,
  workshiftDetail: null,
};

const workshiftDetailSlice = createSlice({
  name: "workshiftDetail",
  initialState,
  reducers: {
    fetchWorkshiftDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchWorkshiftDetailSuccess: (
      state,
      action: PayloadAction<WorkshiftDetailResponseActual>
    ) => {
      state.loading = false;
      state.success = true;
      state.workshiftDetail = action.payload;
    },
    fetchWorkshiftDetailFailed: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchWorkshiftDetailStart,
  fetchWorkshiftDetailSuccess,
  fetchWorkshiftDetailFailed,
} = workshiftDetailSlice.actions;

export default workshiftDetailSlice.reducer; 