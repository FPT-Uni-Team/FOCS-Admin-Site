import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultParams,
  type ListPageParams,
} from "../../../type/common/common";
import type { StaffDataType } from "../../../type/staff/staff";

interface StaffListState {
  staff: StaffDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: StaffListState = {
  staff: [],
  loading: false,
  error: null,
  params: defaultParams(),
  total: 0,
};

const staffListSlice = createSlice({
  name: "staffList",
  initialState,
  reducers: {
    fetchStaffListStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchStaffListSuccess: (
      state,
      action: PayloadAction<{
        staffs: StaffDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.staff = action.payload.staffs;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchStaffListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.staff = [];
      state.total = 0;
    },
  },
});

export const {
  fetchStaffListStart,
  fetchStaffListSuccess,
  fetchStaffListFailure,
} = staffListSlice.actions;
export default staffListSlice.reducer;
