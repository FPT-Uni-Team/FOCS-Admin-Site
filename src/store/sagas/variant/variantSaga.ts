import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse, AxiosError } from "axios";

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
import {
  updateVariantGroupStart,
  updateVariantGroupSuccess,
  updateVariantGroupFailure,
} from "../../slices/variant/variantGroupUpdateSlice";
import {
  createVariantGroupStart,
  createVariantGroupSuccess,
  createVariantGroupFailure,
} from "../../slices/variant/variantGroupCreateSlice";

import variantGroupsService, { variantService } from "../../../services/variantService";
import type { VariantGroup, VariantGroupCreateRequest, VariantGroupUpdateRequest, Variant } from "../../../type/variant/variant";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import {
  fetchVariantsStart,
  fetchVariantsSuccess,
  fetchVariantsFailure,
} from "../../slices/variant/variantListSlice";
import {
  fetchVariantDetailStart,
  fetchVariantDetailSuccess,
  fetchVariantDetailFailure,
} from "../../slices/variant/variantDetailSlice";

const { getListVariantGroups, createVariantGroup, getDetailVariantGroup, updateVariantGroup } = variantGroupsService;

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

function* fetchUpdateVariantGroup(
  action: PayloadAction<{ id: string; name: string }>
): Generator<Effect, void, AxiosResponse<VariantGroupUpdateRequest>> {
  try {
    const response = yield call(() => updateVariantGroup(action.payload.id, { name: action.payload.name }));
    yield put(updateVariantGroupSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred while updating variant group";
    yield put(updateVariantGroupFailure(message));
  }
}

function* fetchCreateVariantGroup(
  action: PayloadAction<VariantGroupCreateRequest>
): Generator<Effect, void, AxiosResponse<VariantGroupCreateRequest>> {
  try {
    yield call(() => createVariantGroup(action.payload));
    yield put(createVariantGroupSuccess());
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred while creating variant group";
    yield put(createVariantGroupFailure(message));
  }
}

function* fetchVariantsList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => variantService.getListVariants(action.payload));
    // Transform the response to match ListPageResponse format
    const transformedData = {
      total_count: response.data.total_count || 0,
      page_index: action.payload.page || 1,
      page_size: action.payload.page_size || 10,
      items: response.data.items || []
    };
    yield put(fetchVariantsSuccess(transformedData));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch variants";
    yield put(fetchVariantsFailure(errorMessage));
  }
}

function* fetchVariantDetail(
  action: PayloadAction<{ variantId: string }>
): Generator<Effect, void, AxiosResponse<Variant>> {
  try {
    const { variantId } = action.payload;
    const response = yield call(() => variantService.getDetailVariant(variantId));
    yield put(fetchVariantDetailSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch variant detail";
    yield put(fetchVariantDetailFailure(errorMessage));
  }
}

export function* watchVariantSaga() {
  yield takeLatest(fetchVariantGroupsStart.type, fetchVariantGroupsList);
  yield takeLatest(fetchVariantGroupDetailStart.type, fetchVariantGroupDetail);
  yield takeLatest(updateVariantGroupStart.type, function* (action) {
    yield* withGlobalLoading(fetchUpdateVariantGroup, action);
  });
  yield takeLatest(createVariantGroupStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreateVariantGroup, action);
  });
  yield takeLatest(fetchVariantsStart.type, fetchVariantsList);
  yield takeLatest(fetchVariantDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchVariantDetail, action);
  });
}
