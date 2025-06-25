import { call, put, takeEvery, type Effect } from "redux-saga/effects";
import {
  fetchPromotionsFailure,
  fetchPromotionsStart,
  fetchPromotionsSuccess,
} from "../../slices/promotion/promotionListSlice";
import promotionService from "../../../services/promotionService";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  PromotionListParams,
  PromotionPayload,
} from "../../../type/promotion/promotion";
import { objectMapper } from "../../../helper/mapperObject";
import { fieldMap } from "../../../utils/objectMapper/promotion";
import type { AxiosResponse } from "axios";
import type { ListPageResponse } from "../../../type/common/common";
import {
  createPromotionFailure,
  createPromotionStart,
  createPromotionSuccess,
} from "../../slices/promotion/promotionCreateSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import {
  fetchPromotionDetailFailed,
  fetchPromotionDetailStart,
  fetchPromotionDetailSuccess,
} from "../../slices/promotion/promotionDetailSlice";

const { getListPromtions, createPromotion, getPromotionDetail } =
  promotionService;

function* fetchPromotionList(
  action: PayloadAction<PromotionListParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListPromtions(action.payload));
    const dataMapped = objectMapper(response.data.items, fieldMap);
    const total = response.data.total_count;
    yield put(fetchPromotionsSuccess({ promotions: dataMapped, total: total }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchPromotionsFailure(errorMessage));
  }
}
function* fetchCreatePromotion(
  action: PayloadAction<PromotionPayload>
): Generator<Effect, void, PromotionPayload> {
  try {
    const response = yield call(() => createPromotion(action.payload));
    yield put(createPromotionSuccess(response));
  } catch {
    yield put(createPromotionFailure());
  }
}

function* fetchPromotionDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<PromotionPayload>> {
  try {
    const response = yield call(() => getPromotionDetail(action.payload));
    yield put(fetchPromotionDetailSuccess(response.data));
  } catch {
    yield put(fetchPromotionDetailFailed());
  }
}

export function* watchPromotionSaga() {
  yield takeEvery(fetchPromotionsStart.type, fetchPromotionList);
  yield takeEvery(createPromotionStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreatePromotion, action);
  });
  yield takeEvery(fetchPromotionDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchPromotionDetail, action);
  });
}
