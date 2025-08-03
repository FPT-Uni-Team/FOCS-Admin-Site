import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const variantGroupsService = {
  getListVariantGroups: (params: ListPageParams) =>
    axiosClient.post(endpoints.variant.list(), params),
  getDetailVariantGroup: (id: string) =>
    axiosClient.get(endpoints.variant.detail(id)),
};

export default variantGroupsService;
