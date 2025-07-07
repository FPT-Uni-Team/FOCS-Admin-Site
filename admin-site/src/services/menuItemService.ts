import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ImageFile } from "../context/ImageUploadContext";
import type { ListPageParams } from "../type/common/common";
import type { MenuItem } from "../type/menu/menu";

interface UploadImageMenuItemParams {
  images: ImageFile[];
  mainImages: boolean[];
  menuItemId: string;
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
  uploadImageMenuItem: (params: UploadImageMenuItemParams) => {
    const formData = new FormData();
    params.images.forEach((file) => {
      formData.append("files", file);
    });
    params.mainImages.forEach((isMain) => {
      formData.append("isMain", String(isMain));
    });
    formData.append("menuItemId", params.menuItemId);
    return axiosClient.post(endpoints.image.upload(), formData);
  },
};

export default menuItemService;
