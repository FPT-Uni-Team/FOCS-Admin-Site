import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItem } from "../../../type/menu/menu";

interface MenuItemUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  menuItemSuccess: MenuItem;
}

const initialState: MenuItemUpdateState = {
  loading: false,
  success: false,
  error: null,
  menuItemSuccess: {
    name: "",
    description: "",
    images: "",
    base_price: 0,
    is_available: true,
    category_ids: [],
    store_id: "",
    variant_groups: [],
  },
};

const menuItemUpdateSlice = createSlice({
  name: "menuItemUpdate",
  initialState,
  reducers: {
    updateMenuItemStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: MenuItem) => ({ payload }),
    },
    updateMenuItemSuccess: (state, action: PayloadAction<MenuItem>) => {
      state.loading = false;
      state.success = true;
      state.menuItemSuccess = action.payload;
    },
    updateMenuItemFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetMenuItem: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateMenuItemStart,
  updateMenuItemSuccess,
  updateMenuItemFailure,
  resetMenuItem,
} = menuItemUpdateSlice.actions;

export default menuItemUpdateSlice.reducer;
