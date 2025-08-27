import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const customerService = {
  getListCustomer: (params: ListPageParams) =>
    axiosClient.post(endpoints.customer.list(), params),
  getDetailCustomer: (params: string) =>
    axiosClient.get(endpoints.customer.detail(params)),
  changeStatus: (params: string, id: string) =>
    axiosClient.patch(endpoints.customer.changeStatus(params, id)),
};

export default customerService;
