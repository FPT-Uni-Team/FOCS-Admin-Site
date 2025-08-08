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
import type { CategoryListDataType } from "../../../type/category/category";
import {
  updateMenuItemFailure,
  updateMenuItemStart,
  updateMenuItemSuccess,
} from "../../slices/menuItem/menuItemUpdateSlice";
import { changeStatusMenuItemStart } from "../../action/menuItemAction";
import {
  deleteMenuItemStart,
  deleteMenuItemSuccess,
  deleteMenuItemFailure,
} from "../../slices/menuItem/menuItemDeleteSlice";

const {
  getListMenuItems,
  createMenuItem,
  uploadImageMenuItem,
  menuItemDetail,
  menuItemImage,
  menuItemGroups,
  menuItemCategory,
  menuItemUpdate,
  deleteMenuItem,
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
    const menuItemId = response.data;
    yield call(uploadImageMenuItem, {
      images: action.payload.images.images,
      mainImages: action.payload.images.mainImages,
      menuItemId: menuItemId as string,
    });
    yield put(createMenuItemSuccess());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // const errorMsg = error.errors.Description;
    console.log(error);
    yield put(createMenuItemFailure("Create Failed" as string));
  }
}

function* fetchMenuItemUpdate(
  action: PayloadAction<MenuItem>
): Generator<Effect, void, AxiosResponse<MenuItem>> {
  try {
    console.log(action.payload);
    const response = yield call(() =>
      menuItemUpdate({
        menuItemId: action.payload.id as string,
        data: action.payload,
      })
    );
    console.log("response", response);
    yield put(updateMenuItemSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(updateMenuItemFailure(errorMessage));
  }
}

function* fetchMenuItemDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<unknown>> {
  try {
    const response = yield call(() => menuItemDetail(action.payload));
    const menuItemDetailData = response.data as MenuItem;
    const responseImage = yield call(() => menuItemImage(action.payload));
    menuItemDetailData.images = responseImage.data as [];
    const responseVariant = yield call(() => menuItemGroups(action.payload));
    menuItemDetailData.variant_groups = responseVariant.data as VariantGroup[];
    const responseCategory = yield call(() => menuItemCategory(action.payload));
    menuItemDetailData.categories =
      responseCategory.data as CategoryListDataType[];
    yield put(fetchMenuItemDetailSuccess(menuItemDetailData));
  } catch {
    yield put(fetchMenuItemDetailFailed());
  }
}

function* changeStatusWorker(
  action: ReturnType<typeof changeStatusMenuItemStart>
) {
  const { category, menuItemId } = action.payload;
  const status = category === "deactive" ? "disable" : "enable";

  try {
    yield call(() => menuItemService.changeStatus(status, menuItemId));
    yield put(fetchMenuItemDetailStart(menuItemId));
  } catch (error) {
    console.error(error);
  }
}

function* handleDeleteMenuItem(
  action: PayloadAction<{ menuItemId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { menuItemId } = action.payload;

    yield call(deleteMenuItem, menuItemId);
    yield put(deleteMenuItemSuccess({ menuItemId }));
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errorMessage = err.message || "Failed to delete menu item";
    yield put(deleteMenuItemFailure(errorMessage));
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
  yield takeLatest(updateMenuItemStart.type, function* (action) {
    yield* withGlobalLoading(fetchMenuItemUpdate, action);
  });
  yield takeLatest(changeStatusMenuItemStart.type, function* (action) {
    yield* withGlobalLoading(changeStatusWorker, action);
  });
  yield takeLatest(deleteMenuItemStart.type, handleDeleteMenuItem);
}
