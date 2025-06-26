import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { MenuItemListParams } from "../type/menuItem/menuItem";

const menuItemService = {
  getListMenuItems: (params: MenuItemListParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
};

export default menuItemService;
