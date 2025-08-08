import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StaffDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedStaffId: string | null;
}

const initialState: StaffDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedStaffId: null,
};

const staffDeleteSlice = createSlice({
  name: "staffDelete",
  initialState,
  reducers: {
    deleteStaffStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedStaffId = null;
      },
      prepare: (payload: { staffId: string }) => ({ payload }),
    },
    deleteStaffSuccess: (state, action: PayloadAction<{ staffId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedStaffId = action.payload.staffId;
      state.error = null;
    },
    deleteStaffFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedStaffId = null;
    },
    clearDeleteStaffState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedStaffId = null;
    },
  },
});

export const {
  deleteStaffStart,
  deleteStaffSuccess,
  deleteStaffFailure,
  clearDeleteStaffState,
} = staffDeleteSlice.actions;

export default staffDeleteSlice.reducer; 