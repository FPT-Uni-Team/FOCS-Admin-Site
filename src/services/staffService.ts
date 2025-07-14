import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";

const staffService = {
  getListStaffs: (params: ListPageParams) =>
    axiosClient.post(endpoints.staff.list(), params),
};

export default staffService;
