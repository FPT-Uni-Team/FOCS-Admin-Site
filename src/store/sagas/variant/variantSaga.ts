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

import variantGroupsService, { variantService, updateVariant } from "../../../services/variantService";
import type { VariantGroup, VariantGroupCreateRequest, VariantGroupUpdateRequest, Variant, VariantCreateRequest, VariantUpdateRequest, VariantAssignRequest, VariantAssignResponse } from "../../../type/variant/variant";
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
import {
  updateVariantStart,
  updateVariantSuccess,
  updateVariantFailure,
} from "../../slices/variant/variantUpdateSlice";
import {
  createVariantStart,
  createVariantSuccess,
  createVariantFailure,
} from "../../slices/variant/variantCreateSlice";
import {
  assignVariantsStart,
  assignVariantsSuccess,
  assignVariantsFailure,
} from "../../slices/variant/variantAssignSlice";
import {
  deleteVariantGroupStart,
  deleteVariantGroupSuccess,
  deleteVariantGroupFailure,
} from "../../slices/variant/variantGroupDeleteSlice";
import {
  deleteVariantStart,
  deleteVariantSuccess,
  deleteVariantFailure,
} from "../../slices/variant/variantDeleteSlice";

const { getListVariantGroups, createVariantGroup, getDetailVariantGroup, updateVariantGroup, assignVariantsToGroup, deleteVariantGroup } = variantGroupsService;
const { createVariant, deleteVariant } = variantService;

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

function* fetchUpdateVariant(
  action: PayloadAction<{ id: string } & VariantUpdateRequest>
): Generator<Effect, void, AxiosResponse<VariantUpdateRequest>> {
  try {
    const { id, ...payload } = action.payload;
    const response = yield call(() => updateVariant(id, payload));
    yield put(updateVariantSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred while updating variant";
    yield put(updateVariantFailure(message));
  }
}

function* fetchCreateVariant(
  action: PayloadAction<VariantCreateRequest>
): Generator<Effect, void, AxiosResponse<Variant>> {
  try {
    const response = yield call(() => createVariant(action.payload));
    yield put(createVariantSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred while creating variant";
    yield put(createVariantFailure(message));
  }
}

function* fetchAssignVariants(
  action: PayloadAction<VariantAssignRequest>
): Generator<Effect, void, AxiosResponse<VariantAssignResponse>> {
  try {
    const response: AxiosResponse<VariantAssignResponse> = yield call(
      assignVariantsToGroup,
      action.payload
    );
    yield put(assignVariantsSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred while assigning variants";
    yield put(assignVariantsFailure(message));
  }
}

function* handleDeleteVariantGroup(
  action: PayloadAction<{ variantGroupId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { variantGroupId } = action.payload;
    yield call(deleteVariantGroup, variantGroupId);
    yield put(deleteVariantGroupSuccess({ variantGroupId }));
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errorMessage = err.message || "Failed to delete variant group";
    yield put(deleteVariantGroupFailure(errorMessage));
  }
}

function* handleDeleteVariant(
  action: PayloadAction<{ variantId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { variantId } = action.payload;
    yield call(deleteVariant, variantId);
    yield put(deleteVariantSuccess({ variantId }));
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errorMessage = err.message || "Failed to delete variant";
    yield put(deleteVariantFailure(errorMessage));
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
  yield takeLatest(updateVariantStart.type, function* (action) {
    yield* withGlobalLoading(fetchUpdateVariant, action);
  });
  yield takeLatest(createVariantStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreateVariant, action);
  });
  yield takeLatest(assignVariantsStart.type, function* (action) {
    yield* withGlobalLoading(fetchAssignVariants, action);
  });
  yield takeLatest(deleteVariantGroupStart.type, handleDeleteVariantGroup);
  yield takeLatest(deleteVariantStart.type, handleDeleteVariant);
}
