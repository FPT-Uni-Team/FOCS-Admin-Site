import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StaffDetailPayload } from "../../../type/staff/staff";

interface StaffUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  staffSuccess: StaffDetailPayload;
}

const initialState: StaffUpdateState = {
  loading: false,
  success: false,
  error: null,
  staffSuccess: {
    id: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    roles: [],
  },
};

const staffUpdateSlice = createSlice({
  name: "staffUpdate",
  initialState,
  reducers: {
    updateStaffStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: StaffDetailPayload) => ({ payload }),
    },
    updateStaffSuccess: (state, action: PayloadAction<StaffDetailPayload>) => {
      state.loading = false;
      state.success = true;
      state.staffSuccess = action.payload;
    },
    updateStaffFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetStaffUpdate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateStaffStart,
  updateStaffSuccess,
  updateStaffFailure,
  resetStaffUpdate,
} = staffUpdateSlice.actions;

export default staffUpdateSlice.reducer;
