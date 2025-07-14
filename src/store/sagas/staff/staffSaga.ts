import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError, AxiosResponse } from "axios";
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
import type {
  StaffDetailPayload,
  StaffPayload,
} from "../../../type/staff/staff";
import {
  createStaffFailure,
  createStaffStart,
  createStaffSuccess,
} from "../../slices/staff/staffCreateSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import {
  fetchStaffDetailFailed,
  fetchStaffDetailStart,
  fetchStaffDetailSuccess,
} from "../../slices/staff/staffDetailSlice";
import {
  updateStaffFailure,
  updateStaffStart,
  updateStaffSuccess,
} from "../../slices/staff/staffUpdateSlice";

const { getListStaffs, createStaff, getStaffDetail, updateStaff } =
  staffService;

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

export function* fetchCreateStaff(
  action: PayloadAction<StaffPayload>
): Generator<Effect, void, StaffPayload> {
  try {
    const response = yield call(() => createStaff(action.payload));
    yield put(createStaffSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(createStaffFailure(message));
  }
}

export function* fetchStaffDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<StaffDetailPayload>> {
  try {
    const response = yield call(() => getStaffDetail(action.payload));
    yield put(fetchStaffDetailSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "Failed to fetch staff detail";
    yield put(fetchStaffDetailFailed(message));
  }
}

export function* fetchUpdateStaff(
  action: PayloadAction<StaffDetailPayload>
): Generator<Effect, void, AxiosResponse<StaffDetailPayload>> {
  try {
    const response = yield call(() => updateStaff(action.payload));
    yield put(updateStaffSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(updateStaffFailure(message));
  }
}

export function* watchStaffSaga() {
  yield takeLatest(fetchStaffListStart.type, fetchStaffList);
  yield takeLatest(createStaffStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreateStaff, action);
  });
  yield takeLatest(fetchStaffDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchStaffDetail, action);
  });
  yield takeLatest(updateStaffStart.type, function* (action) {
    yield* withGlobalLoading(fetchUpdateStaff, action);
  });
}
