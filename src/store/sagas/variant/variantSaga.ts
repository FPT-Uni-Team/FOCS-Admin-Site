import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import {
  fetchVariantGroupsFailure,
  fetchVariantGroupsStart,
  fetchVariantGroupsSuccess,
} from "../../slices/variant/variantGroupSlice";
import {
  fetchVariantGroupDetailFailure,
  fetchVariantGroupDetailStart,
  fetchVariantGroupDetailSuccess,
} from "../../slices/variant/variantGroupDetailSlice";

import variantGroupsService from "../../../services/variantService";
import type { VariantGroup } from "../../../type/variant/variant";

const { getListVariantGroups, getDetailVariantGroup } = variantGroupsService;

function* fetchVariantGroupsList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListVariantGroups(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchVariantGroupsSuccess({
        menuItems: response.data.items,
        total: total,
      })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchVariantGroupsFailure(errorMessage));
  }
}

function* fetchVariantGroupDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<VariantGroup>> {
  try {
    const response = yield call(() => getDetailVariantGroup(action.payload));
    yield put(fetchVariantGroupDetailSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch variant group detail";
    yield put(fetchVariantGroupDetailFailure(errorMessage));
  }
}

export function* watchVariantSaga() {
  yield takeLatest(fetchVariantGroupsStart.type, fetchVariantGroupsList);
  yield takeLatest(fetchVariantGroupDetailStart.type, fetchVariantGroupDetail);
}
