import { call, put, takeEvery, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { objectMapper } from "../../../helper/mapperObject";
import type { AxiosResponse } from "axios";
import menuItemService from "../../../services/menuItemService";
import { fieldMap } from "../../../utils/objectMapper/menuItem";
import {
  fetchMenuItemsFailure,
  fetchMenuItemsStart,
  fetchMenuItemsSuccess,
} from "../../slices/menuItem/menuItemSlice";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";

const { getListMenuItems } = menuItemService;

function* fetchMenuItemList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListMenuItems(action.payload));
    const dataMapped = objectMapper(response.data.items, fieldMap);
    const total = response.data.total_count;
    yield put(fetchMenuItemsSuccess({ menuItems: dataMapped, total: total }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchMenuItemsFailure(errorMessage));
  }
}

export function* watchMenuSaga() {
  yield takeEvery(fetchMenuItemsStart.type, fetchMenuItemList);
}
