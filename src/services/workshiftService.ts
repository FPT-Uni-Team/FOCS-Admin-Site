import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { WorkshiftListParams, WorkshiftDetailParams, WorkshiftCreatePayload } from "../type/workshift/workshift";

const workshiftService = {
  getListWorkshifts: (params: WorkshiftListParams) =>
    axiosClient.post(endpoints.workshift.list(), params, {
      headers: {
        storeId: params.storeId,
      },
    }),
  getWorkshiftDetail: (params: WorkshiftDetailParams) =>
    axiosClient.get(endpoints.workshift.detail(params.id)),
  createWorkshift: (payload: WorkshiftCreatePayload, storeId: string) =>
    axiosClient.post(endpoints.workshift.create(), payload, {
      headers: {
        storeId: storeId,
      },
    }),
};

export default workshiftService; 