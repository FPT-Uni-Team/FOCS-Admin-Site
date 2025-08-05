import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type { FeedbackUpdateRequest } from "../type/feedback/feedback";

const feedbackService = {
  getListFeedback: (params: ListPageParams) => {
    const requestBody = {
      page: params.page,
      page_size: params.page_size,
    };
    return axiosClient.post(endpoints.feedback.list(), requestBody);
  },
  getFeedbackDetail: (feedbackId: string) => {
    return axiosClient.get(endpoints.feedback.detail(feedbackId));
  },
  updateFeedback: (feedbackId: string, payload: FeedbackUpdateRequest) => {
    return axiosClient.patch(endpoints.feedback.update(feedbackId), payload);
  },
};

export default feedbackService; 