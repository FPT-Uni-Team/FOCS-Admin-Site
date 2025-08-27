import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import type { AxiosError, AxiosResponse } from "axios";
import customerService from "../../../services/customerService";
import {
  fetchCustomerFailure,
  fetchCustomersStart,
  fetchCustomersSuccess,
} from "../../slices/customer/customerList";
import type { CustomerDataType } from "../../../components/common/Columns/Colums";
import {
  fetchCustomerDetailFailed,
  fetchCustomerDetailStart,
  fetchCustomerDetailSuccess,
} from "../../slices/customer/customerDetailSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import {
  changeCustomerStatusFailure,
  changeCustomerStatusStart,
  changeCustomerStatusSuccess,
} from "../../slices/customer/customerChangeStatusSlice";

const { getListCustomer, getDetailCustomer, changeStatus } = customerService;

function* fetchCustomerList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListCustomer(action.payload));
    yield put(fetchCustomersSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch feedbacks";
    yield put(fetchCustomerFailure(errorMessage));
  }
}

function* fetchCustomerDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<CustomerDataType>> {
  try {
    const response = yield call(() => getDetailCustomer(action.payload));
    yield put(fetchCustomerDetailSuccess(response.data));
  } catch {
    yield put(fetchCustomerDetailFailed());
  }
}

function* fetchChangeStatusCustomer(
  action: PayloadAction<{ actionType: string; id: string }>
): Generator<Effect, void, AxiosResponse> {
  try {
    yield call(() =>
      changeStatus(action.payload.actionType, action.payload.id)
    );
    yield put(changeCustomerStatusSuccess());
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(changeCustomerStatusFailure(message));
  }
}

export function* watchCustomerSaga() {
  yield takeLatest(fetchCustomersStart.type, fetchCustomerList);
  yield takeLatest(fetchCustomerDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchCustomerDetail, action);
  });
  yield takeLatest(changeCustomerStatusStart.type, function* (action) {
    yield* withGlobalLoading(fetchChangeStatusCustomer, action);
  });
}
