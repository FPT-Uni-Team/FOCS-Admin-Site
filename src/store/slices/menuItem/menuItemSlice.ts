import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuListDataType } from "../../../type/menu/menu";
import {
  defaultParams,
  type ListPageParams,
} from "../../../type/common/common";

interface MenuItemListState {
  menuItems: MenuListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: MenuItemListState = {
  menuItems: [],
  loading: false,
  error: null,
  params: defaultParams(),
  total: 0,
};

const menuItemSlice = createSlice({
  name: "menuItemList",
  initialState,
  reducers: {
    fetchMenuItemsStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchMenuItemsSuccess: (
      state,
      action: PayloadAction<{
        menuItems: MenuListDataType[];
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
