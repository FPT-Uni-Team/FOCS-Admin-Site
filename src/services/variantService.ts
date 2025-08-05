import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type { VariantGroupCreateRequest, VariantGroupUpdateRequest, VariantUpdateRequest } from "../type/variant/variant";

const variantGroupsService = {
  getListVariantGroups: (params: ListPageParams) =>
    axiosClient.post(endpoints.variantGroup.list(), params),
  createVariantGroup: (payload: VariantGroupCreateRequest) =>
    axiosClient.post(endpoints.variantGroup.create(), payload),
  getDetailVariantGroup: (id: string) =>
    axiosClient.get(endpoints.variantGroup.detail(id)),
  updateVariantGroup: (id: string, payload: VariantGroupUpdateRequest) =>
    axiosClient.patch(endpoints.variantGroup.update(id), payload),
};

const variantService = {
  getListVariants: (params: ListPageParams) =>
    axiosClient.post(endpoints.variant.list(), {
      page: params.page,
      page_size: params.page_size,
      search_by: params.search_by,
      search_value: params.search_value,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      filters: params.filters,
    }),
  getDetailVariant: (id: string) =>
    axiosClient.get(endpoints.variant.detail(id)),
};

const updateVariant = (id: string, payload: VariantUpdateRequest) =>
  axiosClient.put(endpoints.variant.update(id), payload);

export { variantGroupsService, variantService, updateVariant };
export default variantGroupsService;
