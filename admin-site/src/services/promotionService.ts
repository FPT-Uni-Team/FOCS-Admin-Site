import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type {
  PromotionListParams,
  PromotionPayload,
} from "../type/promotion/promotion";

// const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

const promotionService = {
  getListPromtions: (params: PromotionListParams) =>
    axiosClient.post(endpoints.promotion.list(), params),
  createPromotion: (promotionData: PromotionPayload) =>
    axiosClient.post(endpoints.promotion.create(), promotionData),
  getPromotionDetail: (promotionId: string) =>
    axiosClient.get(endpoints.promotion.detail(promotionId)),
};

export default promotionService;
