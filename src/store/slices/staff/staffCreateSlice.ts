import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StaffPayload } from "../../../type/staff/staff";

interface StaffCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  staffSuccess: StaffPayload;
}

const initialState: StaffCreateState = {
  loading: false,
  success: false,
  error: null,
  staffSuccess: {
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    first_name: "",
    last_name: "",
  },
};

const staffCreateSlice = createSlice({
  name: "staffCreate",
  initialState,
  reducers: {
    createStaffStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: StaffPayload) => ({ payload }),
    },
    createStaffSuccess: (state, action: PayloadAction<StaffPayload>) => {
      state.loading = false;
      state.success = true;
      state.staffSuccess = action.payload;
    },
    createStaffFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetCreateStaff: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  createStaffStart,
  createStaffSuccess,
  createStaffFailure,
  resetCreateStaff,
} = staffCreateSlice.actions;

export default staffCreateSlice.reducer;
