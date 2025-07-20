import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";

import type { TableListParams, TableListResponse, TableDataType } from "../../../type/table/table";
import {
  fetchTablesFailure,
  fetchTablesStart,
  fetchTablesSuccess,
} from "../../slices/table/tableListSlice";
import {
  fetchTableDetailStart,
  fetchTableDetailSuccess,
  fetchTableDetailFailure,
} from "../../slices/table/tableDetailSlice";
import tableService from "../../../services/tableService";

const { getListTables, getTableDetail } = tableService;

function* fetchTableList(
  action: PayloadAction<TableListParams>
): Generator<Effect, void, AxiosResponse<TableListResponse>> {
  try {
    const response = yield call(() => getListTables(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchTablesSuccess({ tables: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tables";
    yield put(fetchTablesFailure(errorMessage));
  }
}

function* fetchTableDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<TableDataType>> {
  try {
    const response = yield call(() => getTableDetail(action.payload));
    yield put(fetchTableDetailSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch table detail";
    yield put(fetchTableDetailFailure(errorMessage));
  }
}

export function* watchTableSaga() {
  yield takeLatest(fetchTablesStart.type, fetchTableList);
  yield takeLatest(fetchTableDetailStart.type, fetchTableDetail);
} 