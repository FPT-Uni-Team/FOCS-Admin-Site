import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type { WorkshiftListParams, WorkshiftListResponse, WorkshiftDetailResponseActual, WorkshiftCreatePayload } from "../../../type/workshift/workshift";
import workshiftService from "../../../services/workshiftService";
import {
  fetchWorkshiftListFailure,
  fetchWorkshiftListStart,
  fetchWorkshiftListSuccess,
} from "../../slices/workshift/workshiftListSlice";
import {
  fetchWorkshiftDetailStart,
  fetchWorkshiftDetailSuccess,
  fetchWorkshiftDetailFailed,
} from "../../slices/workshift/workshiftDetailSlice";
import {
  createWorkshiftStart,
  createWorkshiftSuccess,
  createWorkshiftFailure,
} from "../../slices/workshift/workshiftCreateSlice";

const { getListWorkshifts, getWorkshiftDetail, createWorkshift } = workshiftService;

function* fetchWorkshiftList(
  action: PayloadAction<WorkshiftListParams>
): Generator<Effect, void, AxiosResponse<WorkshiftListResponse>> {
  try {
    const response = yield call(() => getListWorkshifts(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchWorkshiftListSuccess({ workshifts: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch workshifts";
    yield put(fetchWorkshiftListFailure(errorMessage));
  }
}

function* fetchWorkshiftDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<WorkshiftDetailResponseActual>> {
  try {
    const id = action.payload;
    const response = yield call(() => getWorkshiftDetail({ id }));
    yield put(fetchWorkshiftDetailSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch workshift detail";
    yield put(fetchWorkshiftDetailFailed(errorMessage));
  }
}

function* createWorkshiftSaga(
  action: PayloadAction<{ payload: WorkshiftCreatePayload; storeId: string }>
): Generator<Effect, void, AxiosResponse<WorkshiftCreatePayload>> {
  try {
    const response = yield call(() => createWorkshift(action.payload.payload, action.payload.storeId));
    yield put(createWorkshiftSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create workshift";
    yield put(createWorkshiftFailure(errorMessage));
  }
}

export function* watchWorkshiftSaga() {
  yield takeLatest(fetchWorkshiftListStart.type, fetchWorkshiftList);
  yield takeLatest(fetchWorkshiftDetailStart.type, fetchWorkshiftDetail);
  yield takeLatest(createWorkshiftStart.type, createWorkshiftSaga);
} 