import { call, put, takeLatest, type Effect } from "redux-saga/effects";
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
import { fieldMapPromotion } from "../../../utils/objectMapper/promotion";
import { fieldMap } from "../../../utils/objectMapper/menuItem";
import type { AxiosError, AxiosResponse } from "axios";
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
import {
  updatePromotionFailure,
  updatePromotionStart,
  updatePromotionSuccess,
} from "../../slices/promotion/promotionUpdateSlice";
import { couponService } from "../../../services/couponService";
import type { CouponAdminDTO } from "../../../type/coupon/coupon";
import menuItemService from "../../../services/menuItemService";
import type { MenuListDataType } from "../../../type/menu/menu";
import {
  changeStatusPromotionsFailure,
  changeStatusPromotionsStart,
  changeStatusPromotionsSuccess,
} from "../../slices/promotion/promotionChangeStatusSlice";
import {
  deletePromotionStart,
  deletePromotionSuccess,
  deletePromotionFailure,
} from "../../slices/promotion/promotionDeleteSlice";

const {
  getListPromtions,
  createPromotion,
  getPromotionDetail,
  updatePromotion,
  changeStatus,
  deletePromotion,
} = promotionService;

const { getListCouponByIDs } = couponService;
const { getListMenuItemsIds } = menuItemService;

function* fetchPromotionList(
  action: PayloadAction<PromotionListParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListPromtions(action.payload));
    const dataMapped = objectMapper(response.data.items, fieldMapPromotion);
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
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(createPromotionFailure(message));
  }
}

function* fetchPromotionDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<PromotionPayload>> {
  try {
    const response = yield call(() => getPromotionDetail(action.payload));
    let dataResponse = response.data;
    if (response?.data?.coupon_ids && response.data.coupon_ids.length > 0) {
      const responseCoupon = yield call(() =>
        getListCouponByIDs(response?.data?.coupon_ids as string[])
      );
      dataResponse = {
        ...dataResponse,
        coupon_lists: responseCoupon.data as CouponAdminDTO[],
      };
    }
    if (
      response?.data?.accept_for_items &&
      response?.data?.accept_for_items.length > 0
    ) {
      const responseMenuItems = yield call(() =>
        getListMenuItemsIds(response?.data?.accept_for_items as string[])
      );

      const dataMappedMenuItems = objectMapper(
        Array.isArray(responseMenuItems.data)
          ? responseMenuItems.data
          : [responseMenuItems.data],
        fieldMap
      );

      dataResponse = {
        ...dataResponse,
        accept_for_items_lists: dataMappedMenuItems as MenuListDataType[],
      };
    }

    if (response?.data?.promotion_item_condition) {
      const responseMenuItemByGet = yield call(() =>
        getListMenuItemsIds([
          response?.data?.promotion_item_condition?.buy_item_id,
          response?.data?.promotion_item_condition?.get_item_id,
        ] as string[])
      );

      const dataMappedMenuItemByGet = objectMapper(
        Array.isArray(responseMenuItemByGet.data)
          ? responseMenuItemByGet.data
          : [responseMenuItemByGet.data],
        fieldMap
      );
      dataResponse = {
        ...dataResponse,
        promotion_item_condition: {
          ...dataResponse.promotion_item_condition,
          buy_item: dataMappedMenuItemByGet[0],
          get_item: dataMappedMenuItemByGet[1],
        },
      };
    }
    yield put(fetchPromotionDetailSuccess(dataResponse));
  } catch {
    yield put(fetchPromotionDetailFailed());
  }
}

function* fetchUpdatePromotion(
  action: PayloadAction<PromotionPayload>
): Generator<Effect, void, PromotionPayload> {
  try {
    yield call(() => updatePromotion(action.payload));
    yield put(updatePromotionSuccess());
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(updatePromotionFailure(message));
  }
}

function* fetchChangeStatusPromotion(
  action: PayloadAction<{ category: string; promotionId: string }>
): Generator<Effect, void, AxiosResponse> {
  try {
    yield call(() =>
      changeStatus(action.payload.category, action.payload.promotionId)
    );
    yield put(changeStatusPromotionsSuccess());
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    yield put(changeStatusPromotionsFailure(message));
  }
}

function* handleDeletePromotion(
  action: PayloadAction<{ promotionId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { promotionId } = action.payload;

    yield call(deletePromotion, promotionId);
    yield put(deletePromotionSuccess({ promotionId }));
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errorMessage = err.message || "Failed to delete promotion";
    yield put(deletePromotionFailure(errorMessage));
  }
}

export function* watchPromotionSaga() {
  yield takeLatest(fetchPromotionsStart.type, fetchPromotionList);
  yield takeLatest(createPromotionStart.type, function* (action) {
    yield* withGlobalLoading(fetchCreatePromotion, action);
  });
  yield takeLatest(fetchPromotionDetailStart.type, function* (action) {
    yield* withGlobalLoading(fetchPromotionDetail, action);
  });
  yield takeLatest(updatePromotionStart.type, function* (action) {
    yield* withGlobalLoading(fetchUpdatePromotion, action);
  });
  yield takeLatest(changeStatusPromotionsStart.type, function* (action) {
    yield* withGlobalLoading(fetchChangeStatusPromotion, action);
  });
  yield takeLatest(deletePromotionStart.type, handleDeletePromotion);
}
