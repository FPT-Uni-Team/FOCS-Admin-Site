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
import variantGroupsService from "../../../services/variantService";

const { getListVariantGroups } = variantGroupsService;

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

export function* watchVariantSaga() {
  yield takeLatest(fetchVariantGroupsStart.type, fetchVariantGroupsList);
}
