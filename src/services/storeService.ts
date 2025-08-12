import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

export interface StoreConfig {
  id: string;
  open_time: string;
  close_time: string;
  currency: string;
  payment_config: number;
  logo_url: string;
  is_self_service: boolean;
  discount_strategy: number;
  allow_combine_promotion_coupon: boolean;
  spending_rate: number;
}

const orderService = {
  getDetailStoreSetting: () =>
    axiosClient.get(
      endpoints.storeSetting.detail(localStorage.getItem("storeId") as string)
    ),
  updateStoreSetting: (storeData: StoreConfig) =>
    axiosClient.put(
      endpoints.storeSetting.update(localStorage.getItem("storeId") as string),
      storeData
    ),
};

export default orderService;
