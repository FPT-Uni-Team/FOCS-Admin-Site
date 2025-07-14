import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StaffDetailPayload } from "../../../type/staff/staff";

interface StaffDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  staff: StaffDetailPayload;
}

const initialState: StaffDetailState = {
  loading: false,
  success: false,
  error: null,
  staff: {
    id: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    roles: [],
  },
};

const staffDetailSlice = createSlice({
  name: "staffDetail",
  initialState,
  reducers: {
    fetchStaffDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchStaffDetailSuccess: (
      state,
      action: PayloadAction<StaffDetailPayload>
    ) => {
      state.loading = false;
      state.success = true;
      state.staff = action.payload;
    },
    fetchStaffDetailFailed: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStaffDetailStart,
  fetchStaffDetailSuccess,
  fetchStaffDetailFailed,
} = staffDetailSlice.actions;

export default staffDetailSlice.reducer;
