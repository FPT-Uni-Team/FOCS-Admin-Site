import { call, put, takeEvery, type Effect } from "redux-saga/effects";
import {
  fetchPromotionsFailure,
  fetchPromotionsStart,
  fetchPromotionsSuccess,
} from "../../slices/promotion/promotionListSlice";
import promotionService from "../../../services/promotionService";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PromotionListParams } from "../../../type/promotion/promotion";
import { objectMapper } from "../../../helper/mapperObject";
import { fieldMap } from "../../../utils/objectMapper/promotion";

export interface PromotionListResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: [];
}

const { getListPromtions } = promotionService;

function* fetchPromotionList(
  action: PayloadAction<PromotionListParams>
): Generator<Effect, void, PromotionListResponse> {
  try {
    const response: PromotionListResponse = yield call(() =>
      getListPromtions(action.payload)
    );
    const dataMapped = objectMapper(response.items, fieldMap);
    console.log("dataMapped", dataMapped);
    yield put(fetchPromotionsSuccess(dataMapped));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    yield put(fetchPromotionsFailure(errorMessage));
  }
}

export function* watchPromotionSaga() {
  yield takeEvery(fetchPromotionsStart.type, fetchPromotionList);
}
