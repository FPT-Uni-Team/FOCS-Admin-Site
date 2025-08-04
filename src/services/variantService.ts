import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type { VariantGroupUpdateRequest } from "../type/variant/variant";

const variantGroupsService = {
  getListVariantGroups: (params: ListPageParams) =>
    axiosClient.post(endpoints.variant.list(), params),
  getDetailVariantGroup: (id: string) =>
    axiosClient.get(endpoints.variant.detail(id)),
  updateVariantGroup: (id: string, payload: VariantGroupUpdateRequest) =>
    axiosClient.patch(endpoints.variant.update(id), payload),
};

export default variantGroupsService;
