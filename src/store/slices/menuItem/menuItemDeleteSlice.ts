import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MenuItemDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedMenuItemId: string | null;
}

const initialState: MenuItemDeleteState = {
  loading: false,
  error: null,
  success: false,
  deletedMenuItemId: null,
};

const menuItemDeleteSlice = createSlice({
  name: "menuItemDelete",
  initialState,
  reducers: {
    deleteMenuItemStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.deletedMenuItemId = null;
      },
      prepare: (payload: { menuItemId: string }) => ({ payload }),
    },
    deleteMenuItemSuccess: (state, action: PayloadAction<{ menuItemId: string }>) => {
      state.loading = false;
      state.success = true;
      state.deletedMenuItemId = action.payload.menuItemId;
      state.error = null;
    },
    deleteMenuItemFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.deletedMenuItemId = null;
    },
    clearDeleteMenuItemState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedMenuItemId = null;
    },
  },
});

export const {
  deleteMenuItemStart,
  deleteMenuItemSuccess,
  deleteMenuItemFailure,
  clearDeleteMenuItemState,
} = menuItemDeleteSlice.actions;

export default menuItemDeleteSlice.reducer; 