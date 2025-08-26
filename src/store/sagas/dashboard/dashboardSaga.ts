import { call, put, takeLatest } from "redux-saga/effects";
import dashboardService from "../../../services/dashboardService";
import {
  fetchOrderStatisticStart,
  fetchOrderStatisticSuccess,
  fetchOrderStatisticFailure,
  fetchOverviewStatisticStart,
  fetchOverviewStatisticSuccess,
  fetchOverviewStatisticFailure,
  fetchKitchenStatisticStart,
  fetchKitchenStatisticSuccess,
  fetchKitchenStatisticFailure,
  fetchFinanceStatisticStart,
  fetchFinanceStatisticSuccess,
  fetchFinanceStatisticFailure,
} from "../../slices/dashboard/dashboardSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DashboardParams } from "../../../type/dashboard/dashboard";

function* fetchOrderStatisticSaga(action: PayloadAction<DashboardParams>) {
  try {
    const response: { data: any } = yield call(
      dashboardService.getOrderStatistic,
      action.payload
    );
    yield put(fetchOrderStatisticSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchOrderStatisticFailure(
        error.response?.data?.message || "Lỗi khi tải thống kê đơn hàng"
      )
    );
  }
}

function* fetchOverviewStatisticSaga(action: PayloadAction<DashboardParams>) {
  try {
    const response: { data: any } = yield call(
      dashboardService.getOverviewStatistic,
      action.payload
    );
    yield put(fetchOverviewStatisticSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchOverviewStatisticFailure(
        error.response?.data?.message || "Lỗi khi tải thống kê tổng quan"
      )
    );
  }
}

function* fetchKitchenStatisticSaga(action: PayloadAction<DashboardParams>) {
  try {
    const response: { data: any } = yield call(
      dashboardService.getKitchenStatistic,
      action.payload
    );
    yield put(fetchKitchenStatisticSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchKitchenStatisticFailure(
        error.response?.data?.message || "Lỗi khi tải thống kê bếp"
      )
    );
  }
}

function* fetchFinanceStatisticSaga() {
  try {
    const response: { data: any } = yield call(
      dashboardService.getFinanceStatistic
    );
    yield put(fetchFinanceStatisticSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchFinanceStatisticFailure(
        error.response?.data?.message || "Lỗi khi tải thống kê tài chính"
      )
    );
  }
}

export function* dashboardSaga() {
  yield takeLatest(fetchOrderStatisticStart.type, fetchOrderStatisticSaga);
  yield takeLatest(fetchOverviewStatisticStart.type, fetchOverviewStatisticSaga);
  yield takeLatest(fetchKitchenStatisticStart.type, fetchKitchenStatisticSaga);
  yield takeLatest(fetchFinanceStatisticStart.type, fetchFinanceStatisticSaga);
}
