import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultParams,
  type ListPageParams,
  type ListPageResponse,
} from "../../../type/common/common";
import type { CustomerDataType } from "../../../components/common/Columns/Colums";

interface CustomerListState {
  customers: CustomerDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: CustomerListState = {
  customers: [],
  loading: false,
  error: null,
  params: defaultParams(10),
  total: 0,
};

const customerSlice = createSlice({
  name: "customerList",
  initialState,
  reducers: {
    fetchCustomersStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchCustomersSuccess: (state, action: PayloadAction<ListPageResponse>) => {
      state.loading = false;
      state.customers = action.payload.items;
      state.total = action.payload.total_count;
      state.error = null;
    },
    fetchCustomerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCustomerFailure,
  fetchCustomersStart,
  fetchCustomersSuccess,
} = customerSlice.actions;
export default customerSlice.reducer;
