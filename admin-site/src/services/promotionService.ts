import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { PromotionListParams } from "../type/promotion/promotion";

const promotionService = {
  getListPromtions: (params: PromotionListParams) => {
    const storeId = localStorage.getItem('storeId') || '550e8400-e29b-41d4-a716-446655440000';
    return axiosClient.post(endpoints.promotion.get(storeId), params);
  },
};

export default promotionService;
