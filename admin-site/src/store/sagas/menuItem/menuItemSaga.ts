import { call, put, takeEvery, type Effect } from "redux-saga/effects";
import {
  fetchMenuItemsFailure,
  fetchMenuItemsStart,
  fetchMenuItemsSuccess,
} from "../../slices/menuItem/menuItemSlice";
import menuItemService from "../../../services/menuItemService";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MenuItemListParams } from "../../../type/menuItem/menuItem";
import { objectMapper } from "../../../helper/mapperObject";
import { fieldMap } from "../../../utils/objectMapper/menuItem";
import type { AxiosResponse } from "axios";
import type { ListPageResponse } from "../../../type/common/common";

const { getListMenuItems } = menuItemService;

function* fetchMenuItemList(
  action: PayloadAction<MenuItemListParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListMenuItems(action.payload));
    const dataMapped = objectMapper(response.data.items, fieldMap);
    const total = response.data.total_count;
    yield put(fetchMenuItemsSuccess({ menuItems: dataMapped, total: total }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch menu items";
    yield put(fetchMenuItemsFailure(errorMessage));
  }
}

export function* watchMenuItemSaga() {
  yield takeEvery(fetchMenuItemsStart.type, fetchMenuItemList);
} 