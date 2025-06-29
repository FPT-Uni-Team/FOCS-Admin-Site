import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const categoryService = {
  getListCategories: (params: ListPageParams) =>
    axiosClient.post(endpoints.category.list(), params),
};

export default categoryService;
