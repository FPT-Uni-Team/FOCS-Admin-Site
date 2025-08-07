import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { categoryRequest } from "../store/sagas/category/categorySaga";
import type { ListPageParams } from "../type/common/common";

const categoryService = {
  getListCategories: (params: ListPageParams) =>
    axiosClient.post(endpoints.category.list(), params),
  createCategories: (params: categoryRequest) =>
    axiosClient.post(endpoints.category.create(), params),
  updateCategories: (params: categoryRequest) =>
    axiosClient.patch(endpoints.category.update(params.id as string), params),
  getCategoryDetail: (params: string) =>
    axiosClient.get(endpoints.category.detail(params)),
  changeStatus: (action: string, id: string) =>
    axiosClient.post(endpoints.category.change(action, id)),
  deleteCategory: (id: string) =>
    axiosClient.delete(endpoints.category.delete(id)),
};

export default categoryService;
