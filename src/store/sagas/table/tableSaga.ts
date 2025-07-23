import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse, AxiosError } from "axios";

import type { TableListParams, TableListResponse, TableDataType, TableCreateRequest, TableDTO } from "../../../type/table/table";
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
import {
  createTableStart,
  createTableSuccess,
  createTableFailure,
} from "../../slices/table/tableCreateSlice";
import tableService from "../../../services/tableService";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";

const { getListTables, getTableDetail, createTable } = tableService;

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

function* fetchCreateTable(
  action: PayloadAction<TableCreateRequest>
): Generator<Effect, void, AxiosResponse<TableDTO>> {
  try {
    const response = yield call(() => createTable(action.payload));
    yield put(createTableSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(createTableFailure(message));
  }
}

export function* watchTableSaga() {
  yield takeLatest(fetchTablesStart.type, fetchTableList);
  yield takeLatest(fetchTableDetailStart.type, fetchTableDetail);
  yield takeLatest(createTableStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreateTable, action);
  });
} 