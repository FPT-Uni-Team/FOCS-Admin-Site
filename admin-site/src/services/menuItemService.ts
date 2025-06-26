import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { MenuItemListParams, MenuItemCreatePayload } from "../type/menuItem/menuItem";

const menuItemService = {
  getListMenuItems: (params: MenuItemListParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
  createMenuItem: (menuItemData: MenuItemCreatePayload) =>
    axiosClient.post(endpoints.menuItem.create(), menuItemData),
};

export default menuItemService;
