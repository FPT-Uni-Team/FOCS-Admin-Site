import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultParams,
} from "../../../type/common/common";
import type { WorkshiftItem, WorkshiftListParams } from "../../../type/workshift/workshift";

interface WorkshiftListState {
  workshifts: WorkshiftItem[];
  loading: boolean;
  error: string | null;
  params: WorkshiftListParams;
  total: number;
}

const initialState: WorkshiftListState = {
  workshifts: [],
  loading: false,
  error: null,
  params: {
    ...defaultParams(),
    storeId: "",
  },
  total: 0,
};

const workshiftListSlice = createSlice({
  name: "workshiftList",
  initialState,
  reducers: {
    fetchWorkshiftListStart: (
      state,
      action: PayloadAction<WorkshiftListParams>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload;
    },
    fetchWorkshiftListSuccess: (
      state,
      action: PayloadAction<{
        workshifts: WorkshiftItem[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.workshifts = action.payload.workshifts;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchWorkshiftListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.workshifts = [];
      state.total = 0;
    },
  },
});

export const {
  fetchWorkshiftListStart,
  fetchWorkshiftListSuccess,
  fetchWorkshiftListFailure,
} = workshiftListSlice.actions;
export default workshiftListSlice.reducer; 