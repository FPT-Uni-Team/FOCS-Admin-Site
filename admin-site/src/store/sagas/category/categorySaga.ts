import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AxiosResponse } from "axios";
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

const { getListCategories } = categoryService;

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

export function* watchCategorySaga() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategoryList);
}
