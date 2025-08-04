import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { OrderListParams } from "../type/order/order";

const orderService = {
  getListOrders: (params: OrderListParams) =>
    axiosClient.post(endpoints.order.list(), params),
};

export default orderService;