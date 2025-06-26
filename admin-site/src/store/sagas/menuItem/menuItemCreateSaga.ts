import { call, put, takeEvery, type Effect } from "redux-saga/effects";
import {
  createMenuItemFailure,
  createMenuItemStart,
  createMenuItemSuccess,
} from "../../slices/menuItem/menuItemCreateSlice";
import menuItemService from "../../../services/menuItemService";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MenuItemCreatePayload } from "../../../type/menuItem/menuItem";
import type { AxiosResponse } from "axios";

const { createMenuItem } = menuItemService;

function* createMenuItemSaga(
  action: PayloadAction<MenuItemCreatePayload>
): Generator<Effect, void, AxiosResponse> {
  try {
    yield call(() => createMenuItem(action.payload));
    yield put(createMenuItemSuccess());
  } catch {
    yield put(createMenuItemFailure());
  }
}

export function* watchMenuItemCreateSaga() {
  yield takeEvery(createMenuItemStart.type, createMenuItemSaga);
} 