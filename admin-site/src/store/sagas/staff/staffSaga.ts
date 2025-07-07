import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import staffService from "../../../services/staffService";
import {
  fetchStaffListFailure,
  fetchStaffListStart,
  fetchStaffListSuccess,
} from "../../slices/staff/staffListSlice";

const { getListStaffs } = staffService;

function* fetchStaffList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListStaffs(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchStaffListSuccess({ staffs: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchStaffListFailure(errorMessage));
  }
}

export function* watchStaffSaga() {
  yield takeLatest(fetchStaffListStart.type, fetchStaffList);
}
