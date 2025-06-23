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
import type { AxiosResponse } from "axios";
import type { ListPageResponse } from "../../../type/common/common";
import { createPromotionStart } from "../../slices/promotion/promotionCreateSlice";

const { getListPromtions, creatPromotion } = promotionService;

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

function* fetchCreatePromotion(action: any): Generator<Effect, void, any> {
  try {
    const response = yield call(() => creatPromotion(action.payload));
    console.log(response);
    //yield put(fetchPromotionsSuccess({ promotions: dataMapped, total: total }));
  } catch (error: unknown) {
    //const errorMessage =
    // instanceof Error ? error.message : "Failed to fetch users";
    //yield put(fetchPromotionsFailure(errorMessage));
  }
}

export function* watchPromotionSaga() {
  yield takeEvery(fetchPromotionsStart.type, fetchPromotionList);
  yield takeEvery(createPromotionStart.type, fetchCreatePromotion);
}
