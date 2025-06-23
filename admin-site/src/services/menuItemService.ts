import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

const menuItemService = {
  getListMenuItems: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.get(fake_stroreId), params),
};

export default menuItemService;
