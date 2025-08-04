import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import orderService from "../../../services/orderService";
import {
  fetchOrdersFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
} from "../../slices/order/orderListSlice";

const { getListOrders } = orderService;

function* fetchOrderList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListOrders(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchOrdersSuccess({ orders: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch orders";
    yield put(fetchOrdersFailure(errorMessage));
  }
}

export default function* orderSaga() {
  yield takeLatest(fetchOrdersStart.type, fetchOrderList);
}