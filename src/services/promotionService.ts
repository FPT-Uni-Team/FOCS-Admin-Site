import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type { PromotionPayload } from "../type/promotion/promotion";

// const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

const promotionService = {
  getListPromtions: (params: ListPageParams) =>
    axiosClient.post(endpoints.promotion.list(), params),
  createPromotion: (promotionData: PromotionPayload) =>
    axiosClient.post(endpoints.promotion.create(), promotionData),
  getPromotionDetail: (promotionId: string) =>
    axiosClient.get(endpoints.promotion.detail(promotionId)),
  updatePromotion: (promotionData: PromotionPayload) =>
    axiosClient.put(
      endpoints.promotion.update(promotionData?.id || ""),
      promotionData
    ),
  changeStatus: (action: string, id: string) =>
    axiosClient.patch(endpoints.promotion.change(action, id)),
  deletePromotion: (id: string) =>
    axiosClient.delete(endpoints.promotion.delete(id)),
};

export default promotionService;
