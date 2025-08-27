import { createSlice } from "@reduxjs/toolkit";
import type { CustomerDataType } from "../../../components/common/Columns/Colums";

interface CustomterDetail {
  loading: boolean;
  success: boolean;
  error: string | null;
  customer: CustomerDataType;
}

const initialState: CustomterDetail = {
  loading: false,
  success: false,
  error: null,
  customer: {
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  },
};

const customerDetailSlice = createSlice({
  name: "customerDetail",
  initialState,
  reducers: {
    fetchCustomerDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchCustomerDetailSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.customer = action.payload;
    },
    fetchCustomerDetailFailed: (state) => {
      state.loading = false;
      state.success = false;
    },
  },
});

export const {
  fetchCustomerDetailStart,
  fetchCustomerDetailSuccess,
  fetchCustomerDetailFailed,
} = customerDetailSlice.actions;

export default customerDetailSlice.reducer;
