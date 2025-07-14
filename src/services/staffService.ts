import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type { StaffDetailPayload, StaffPayload } from "../type/staff/staff";

const staffService = {
  getListStaffs: (params: ListPageParams) =>
    axiosClient.post(endpoints.staff.list(), params),
  createStaff: (payload: StaffPayload) =>
    axiosClient.post(endpoints.staff.create(), payload),
  getStaffDetail: (id: string) => axiosClient.get(endpoints.staff.detail(id)),
  updateStaff: (payload: StaffDetailPayload) =>
    axiosClient.put(endpoints.staff.update(payload.id), payload),
};

export default staffService;
