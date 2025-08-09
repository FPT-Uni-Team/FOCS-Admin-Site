import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkshiftCreatePayload } from "../../../type/workshift/workshift";

interface WorkshiftCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  workshiftSuccess: WorkshiftCreatePayload;
}

const initialState: WorkshiftCreateState = {
  loading: false,
  success: false,
  error: null,
  workshiftSuccess: {
    workDate: "",
    shift: [],
  },
};

const workshiftCreateSlice = createSlice({
  name: "workshiftCreate",
  initialState,
  reducers: {
    createWorkshiftStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: WorkshiftCreatePayload, storeId: string) => ({ 
        payload: { payload, storeId } 
      }),
    },
    createWorkshiftSuccess: (state, action: PayloadAction<WorkshiftCreatePayload>) => {
      state.loading = false;
      state.success = true;
      state.workshiftSuccess = action.payload;
    },
    createWorkshiftFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetCreateWorkshift: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  createWorkshiftStart,
  createWorkshiftSuccess,
  createWorkshiftFailure,
  resetCreateWorkshift,
} = workshiftCreateSlice.actions;

export default workshiftCreateSlice.reducer; 