import { createSlice } from "@reduxjs/toolkit";
import type { MenuItem } from "../../../type/menu/menu";

interface MenuItemDetail {
  loading: boolean;
  success: boolean;
  error: string | null;
  menuItem: MenuItem;
}

const initialState: MenuItemDetail = {
  loading: false,
  success: false,
  error: null,
  menuItem: {},
};

const menuItemDetailSlice = createSlice({
  name: "menuItemDetail",
  initialState,
  reducers: {
    fetchMenuItemDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchMenuItemDetailSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.menuItem = action.payload;
    },
    fetchMenuItemDetailFailed: (state) => {
      state.loading = false;
      state.success = false;
    },
  },
});

export const {
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
  fetchMenuItemDetailFailed,
} = menuItemDetailSlice.actions;

export default menuItemDetailSlice.reducer;
