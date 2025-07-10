import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ImageFile } from "../context/ImageUploadContext";
import type { ListPageParams } from "../type/common/common";
import type { ImageMetadata, MenuItem } from "../type/menu/menu";
import type { VariantGroup } from "../type/variant/variant";

interface UploadImageMenuItemParams {
  images: ImageFile[];
  mainImages: boolean[];
  menuItemId: string;
}
export interface metadataImage {
  id: null | string;
  isDeleted: boolean;
  isMain: boolean;
}

const menuItemService = {
  getListMenuItems: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
  getListMenuItemsIds: (params: string[]) =>
    axiosClient.post(endpoints.menuItem.listByIds(), params),
  createMenuItem: (params: MenuItem) =>
    axiosClient.post(endpoints.menuItem.create(), params),
  menuItemDetail: (params: string) =>
    axiosClient.get(endpoints.menuItem.detail(params)),
  menuItemImage: (params: string) =>
    axiosClient.get(endpoints.menuItem.images(params)),
  menuItemGroups: (params: string) =>
    axiosClient.get(endpoints.menuItem.variantGroups(params)),
  menuItemUpdate: (params: { menuItemId: string; data: MenuItem }) =>
    axiosClient.put(endpoints.menuItem.update(params.menuItemId), params.data),
  createMenuItemGroupsVariant: (params: {
    menuItemId: string;
    data: VariantGroup;
  }) =>
    axiosClient.post(
      endpoints.menuItem.createVariantGroups(params.menuItemId),
      params.data
    ),
  menuItemCategory: (params: string) =>
    axiosClient.post(endpoints.menuItem.menuItemCategory(params)),
  menuItemAssignCategory: (params: {
    menuItemId: string;
    listCategory: string[];
  }) =>
    axiosClient.post(
      endpoints.menuItem.menuItemAssignCategory(params.menuItemId),
      params.listCategory
    ),
  menuItemDeleteCategory: (params: {
    menu_item_id: string;
    cate_ids: string[];
  }) => axiosClient.post(endpoints.menuItem.menuItemDeleteCategory(), params),
  menuItemDeleteVariantGroup: (params: {
    variant_group_id: string[];
    menu_item_id: string;
  }) =>
    axiosClient.delete(
      endpoints.menuItem.menuItemDeleteGroupVariant(params.menu_item_id),
      {
        data: {
          "variant-group-ids": params.variant_group_id,
        },
      }
    ),
  menuItemDeleteVariant: (params: {
    variant_group_id: string;
    menu_item_id: string;
    variant_ids: string[];
  }) =>
    axiosClient.delete(
      endpoints.menuItem.menuItemDeleteVariant(params.menu_item_id),
      {
        data: {
          variant_group_id: params.variant_group_id,
          variant_ids: params.variant_ids,
        },
      }
    ),
  uploadImageMenuItem: (params: UploadImageMenuItemParams) => {
    const formData = new FormData();
    params.images.forEach((file) => {
      formData.append("files", file);
    });
    const metadata: metadataImage[] = [];
    params.mainImages.forEach((isMain) => {
      metadata.push({
        id: null,
        isDeleted: false,
        isMain,
      });
    });
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("menuItemId", params.menuItemId);
    return axiosClient.post(endpoints.image.upload(), formData);
  },
  updateImageMenuItem: (params: {
    menuItemId: string;
    files: File[];
    metadata: ImageMetadata[];
  }) => {
    const formData = new FormData();
    params.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("metadata", JSON.stringify(params.metadata));
    formData.append("menuItemId", params.menuItemId);
    return axiosClient.post(endpoints.image.upload(), formData);
  },
};

export default menuItemService;
