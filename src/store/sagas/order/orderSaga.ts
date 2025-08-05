import { call, put, takeLatest, all, type Effect } from "redux-saga/effects";
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
import {
  fetchOrderDetailStart,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailure,
} from "../../slices/order/orderDetailSlice";
import type { OrderDTO } from "../../../type/order/order";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";

const { getListOrders, getOrderDetail } = orderService;

interface ApiError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

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

function* handleFetchOrderDetail(
  action: PayloadAction<{ orderCode: string }>
): Generator<Effect, void, AxiosResponse<OrderDTO>> {
  try {
    const { orderCode } = action.payload;
    const response = yield call(getOrderDetail, orderCode);
    yield put(fetchOrderDetailSuccess(response.data));
  } catch (error: unknown) {
    const err = error as ApiError;
    const errorMessage = err.response?.data?.message || err.message || "Failed to fetch order detail";
    yield put(fetchOrderDetailFailure(errorMessage));
  }
}

export default function* orderSaga() {
  yield all([
    takeLatest(fetchOrdersStart.type, fetchOrderList),
    takeLatest(fetchOrderDetailStart.type, function* (action) {
      yield* withGlobalLoading(handleFetchOrderDetail, action);
    }),
  ]);
}