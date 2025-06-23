import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

const promotionService = {
  getListPromtions: (params: ListPageParams) =>
    axiosClient.post(endpoints.promotion.get(fake_stroreId), params),
  creatPromotion: (params: any) => {
    axiosClient.post(endpoints.promotion.post(), params);
  },
};

export default promotionService;
