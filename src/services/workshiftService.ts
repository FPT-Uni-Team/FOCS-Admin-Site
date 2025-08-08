import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { WorkshiftListParams } from "../type/workshift/workshift";

const workshiftService = {
  getListWorkshifts: (params: WorkshiftListParams) =>
    axiosClient.post(endpoints.workshift.list(), params, {
      headers: {
        storeId: params.storeId,
      },
    }),
};

export default workshiftService; 