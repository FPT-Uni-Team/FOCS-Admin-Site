import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItemListDataType, MenuItemListParams } from "../../../type/menuItem/menuItem";

interface MenuItemListState {
  menuItems: MenuItemListDataType[];
  loading: boolean;
  error: string | null;
  params: MenuItemListParams;
  total: number;
}

const initialState: MenuItemListState = {
  menuItems: [],
  loading: false,
  error: null,
  params: {
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  },
  total: 0,
};

const menuItemSlice = createSlice({
  name: "menuItemList",
  initialState,
  reducers: {
    fetchMenuItemsStart: (
      state,
      action: PayloadAction<MenuItemListParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchMenuItemsSuccess: (
      state,
      action: PayloadAction<{
        menuItems: MenuItemListDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.menuItems = action.payload.menuItems;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchMenuItemsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.menuItems = [];
      state.total = 0;
    },
  },
});

export const {
  fetchMenuItemsStart,
  fetchMenuItemsSuccess,
  fetchMenuItemsFailure,
} = menuItemSlice.actions;
export default menuItemSlice.reducer;
