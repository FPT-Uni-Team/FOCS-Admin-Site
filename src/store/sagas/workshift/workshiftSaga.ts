import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type { WorkshiftListParams, WorkshiftListResponse } from "../../../type/workshift/workshift";
import workshiftService from "../../../services/workshiftService";
import {
  fetchWorkshiftListFailure,
  fetchWorkshiftListStart,
  fetchWorkshiftListSuccess,
} from "../../slices/workshift/workshiftListSlice";

const { getListWorkshifts } = workshiftService;

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

export function* watchWorkshiftSaga() {
  yield takeLatest(fetchWorkshiftListStart.type, fetchWorkshiftList);
} 