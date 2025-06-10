import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

const promotionService = {
  getListPromtions: () => axiosClient.get(endpoints.promotion.get),
};

export default promotionService;
