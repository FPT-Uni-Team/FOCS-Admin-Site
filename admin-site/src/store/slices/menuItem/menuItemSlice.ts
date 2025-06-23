import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PromotionListParams } from "../../../type/promotion/promotion";
import type { MenuListDataType } from "../../../type/menu/menu";
import type { ListPageParams } from "../../../type/common/common";

interface MenuItemListState {
  menuItems: MenuListDataType[];
  loading: boolean;
  error: string | null;
  params: PromotionListParams;
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
