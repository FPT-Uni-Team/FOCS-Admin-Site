import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WorkshiftDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedWorkshiftId: string | null;
}

const initialState: WorkshiftDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedWorkshiftId: null,
};

const workshiftDeleteSlice = createSlice({
  name: "workshiftDelete",
  initialState,
  reducers: {
    deleteWorkshiftStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedWorkshiftId = null;
      },
      prepare: (payload: { workshiftId: string }) => ({ payload }),
    },
    deleteWorkshiftSuccess: (state, action: PayloadAction<{ workshiftId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedWorkshiftId = action.payload.workshiftId;
      state.error = null;
    },
    deleteWorkshiftFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedWorkshiftId = null;
    },
    clearDeleteWorkshiftState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedWorkshiftId = null;
    },
  },
});

export const {
  deleteWorkshiftStart,
  deleteWorkshiftSuccess,
  deleteWorkshiftFailure,
  clearDeleteWorkshiftState,
} = workshiftDeleteSlice.actions;

export default workshiftDeleteSlice.reducer;
