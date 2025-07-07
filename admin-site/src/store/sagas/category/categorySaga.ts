import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AxiosError, AxiosResponse } from "axios";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import {
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
} from "../../slices/category/categoryListSlice";
import categoryService from "../../../services/categoryService";
import type { CategoryListDataType } from "../../../type/category/category";
import {
  createCategoryStart,
  createCategorySuccess,
} from "../../slices/category/categoryCreateSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import {
  fetchCategoryDetailFailed,
  fetchCategoryDetailStart,
  fetchCategoryDetailSuccess,
} from "../../slices/category/categoryDetailSlice";
import {
  changeCategoryStatusFailure,
  changeCategoryStatusStart,
  changeCategoryStatusSuccess,
} from "../../slices/category/categoryChangeStatusSlice";
import {
  updateCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
} from "../../slices/category/categoryUpdateSlice";

const {
  getListCategories,
  createCategories,
  getCategoryDetail,
  changeStatus,
  updateCategories,
} = categoryService;

export interface categoryRequest {
  id?: string;
  name: string;
  description: string;
  sort_order: number;
}

function* fetchCategoryList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListCategories(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchCategoriesSuccess({ categories: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchCategoriesFailure(errorMessage));
  }
}

function* fetchCategoryCreate(
  action: PayloadAction<categoryRequest>
): Generator<Effect, void, AxiosResponse<CategoryListDataType>> {
  try {
    const response = yield call(() => createCategories(action.payload));
    yield put(createCategorySuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(fetchCategoriesFailure(message));
  }
}

function* fetchCategoryUpdate(
  action: PayloadAction<categoryRequest>
): Generator<Effect, void, AxiosResponse<CategoryListDataType>> {
  try {
    const response = yield call(() => updateCategories(action.payload));
    yield put(updateCategorySuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(updateCategoryFailure(message));
  }
}

function* fetchCategoryDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<CategoryListDataType>> {
  try {
    const response = yield call(() => getCategoryDetail(action.payload));
    yield put(fetchCategoryDetailSuccess(response.data));
  } catch {
    yield put(fetchCategoryDetailFailed());
  }
}

function* fetchChangeStatusCategory(
  action: PayloadAction<{ actionType: string; categoryId: string }>
): Generator<Effect, void, AxiosResponse> {
  try {
    console.log(action.payload);
    yield call(() =>
      changeStatus(action.payload.actionType, action.payload.categoryId)
    );
    yield put(changeCategoryStatusSuccess());
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(changeCategoryStatusFailure(message));
  }
}

export function* watchCategorySaga() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategoryList);
  yield takeLatest(createCategoryStart.type, function* (action) {
    yield* withGlobalLoading(fetchCategoryCreate, action);
  });
  yield takeLatest(fetchCategoryDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchCategoryDetail, action);
  });
  yield takeLatest(changeCategoryStatusStart.type, function* (action) {
    yield* withGlobalLoading(fetchChangeStatusCategory, action);
  });
  yield takeLatest(updateCategoryStart.type, function* (action) {
    yield* withGlobalLoading(fetchCategoryUpdate, action);
  });
}
