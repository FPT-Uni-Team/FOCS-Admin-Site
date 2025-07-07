import { call, put, takeLatest, type Effect } from "redux-saga/effects";
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
import {
  createMenuItemFailure,
  createMenuItemStart,
  createMenuItemSuccess,
} from "../../slices/menuItem/menuItemCreateSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import type { MenuItem, MenuItemCreatePayload } from "../../../type/menu/menu";
import {
  fetchMenuItemDetailFailed,
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
} from "../../slices/menuItem/menuItemDetailSlice";
import type { VariantGroup } from "../../../type/variant/variant";

const {
  getListMenuItems,
  createMenuItem,
  uploadImageMenuItem,
  menuItemDetail,
  menuItemImage,
  menuItemGroups,
} = menuItemService;

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

function* fetchMenuItemCreate(
  action: PayloadAction<MenuItemCreatePayload>
): Generator<Effect, void, AxiosResponse<MenuItem>> {
  try {
    const response = yield call(() => createMenuItem(action.payload.data));
    const menuItemId = response.data.id;
    yield call(uploadImageMenuItem, {
      images: action.payload.images.images,
      mainImages: action.payload.images.mainImages,
      menuItemId: menuItemId as string,
    });
    yield put(createMenuItemSuccess(response.data));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMsg =
      error.response.data.fieldName +
      " " +
      error.response.data.message.toLowerCase();
    yield put(createMenuItemFailure(errorMsg as string));
  }
}

function* fetchMenuItemUpdate(
  action: PayloadAction<MenuItemCreatePayload>
): Generator<Effect, void, AxiosResponse<MenuItem>> {
  try {
    const response = yield call(() => createMenuItem(action.payload.data));
    const menuItemId = response.data.id;
    yield call(uploadImageMenuItem, {
      images: action.payload.images.images,
      mainImages: action.payload.images.mainImages,
      menuItemId: menuItemId as string,
    });
    yield put(createMenuItemSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(createMenuItemFailure(errorMessage));
  }
}

function* fetchMenuItemDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<MenuItem>> {
  try {
    const response = yield call(() => menuItemDetail(action.payload));
    const menuItemDetailData = response.data;
    const responseImage = yield call(() => menuItemImage(action.payload));
    menuItemDetailData.images = responseImage.data as [];
    const responseVariant = yield call(() => menuItemGroups(action.payload));
    menuItemDetailData.variant_groups = responseVariant.data as VariantGroup[];
    yield put(fetchMenuItemDetailSuccess(menuItemDetailData));
  } catch {
    yield put(fetchMenuItemDetailFailed());
  }
}

export function* watchMenuSaga() {
  yield takeLatest(fetchMenuItemsStart.type, fetchMenuItemList);
  yield takeLatest(createMenuItemStart.type, function* (action) {
    yield* withGlobalLoading(fetchMenuItemCreate, action);
  });
  yield takeLatest(fetchMenuItemDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchMenuItemDetail, action);
  });
}
