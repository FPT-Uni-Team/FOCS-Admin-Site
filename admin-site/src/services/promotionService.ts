import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { PromotionListParams } from "../type/promotion/promotion";

// const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

const promotionService = {
  getListPromtions: (params: PromotionListParams) =>
    axiosClient.post(endpoints.promotion.get(), params),
  createPromotion: (promotionData: unknown) =>
    axiosClient.post(endpoints.promotion.post(), promotionData),
};

export default promotionService;
