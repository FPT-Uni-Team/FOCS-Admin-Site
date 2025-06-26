import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItemCreatePayload } from "../../../type/menuItem/menuItem";

interface MenuItemCreateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MenuItemCreateState = {
  loading: false,
  error: null,
  success: false,
};

const menuItemCreateSlice = createSlice({
  name: "menuItemCreate",
  initialState,
  reducers: {
    createMenuItemStart: (state, _action: PayloadAction<MenuItemCreatePayload>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createMenuItemSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    createMenuItemFailure: (state) => {
      state.loading = false;
      state.error = "Failed to create menu item";
      state.success = false;
    },
    resetCreateMenuItemState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  createMenuItemStart,
  createMenuItemSuccess,
  createMenuItemFailure,
  resetCreateMenuItemState,
} = menuItemCreateSlice.actions;
export default menuItemCreateSlice.reducer; 