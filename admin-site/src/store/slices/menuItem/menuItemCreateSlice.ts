import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItem, MenuItemCreatePayload } from "../../../type/menu/menu";

interface MenuItemCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
  menuItemSuccess: MenuItem;
}

const initialState: MenuItemCreateState = {
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

const menuItemCreateSlice = createSlice({
  name: "menuItemCreate",
  initialState,
  reducers: {
    createMenuItemStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: MenuItemCreatePayload) => ({ payload }),
    },
    createMenuItemSuccess: (state, action: PayloadAction<MenuItem>) => {
      state.loading = false;
      state.success = true;
      state.menuItemSuccess = action.payload;
    },
    createMenuItemFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetMenuItemCreate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  createMenuItemStart,
  createMenuItemSuccess,
  createMenuItemFailure,
  resetMenuItemCreate,
} = menuItemCreateSlice.actions;

export default menuItemCreateSlice.reducer;
