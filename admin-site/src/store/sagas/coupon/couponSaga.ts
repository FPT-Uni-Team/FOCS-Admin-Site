import { call, put, takeLatest, all, type Effect } from "redux-saga/effects";
import {
  getCouponDetail,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  setCouponStatus,
  couponService,
} from "../../../services/couponService";
import {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
} from "../../slices/coupon/couponListSlice";
import {
  deleteCouponStart,
  deleteCouponSuccess,
  deleteCouponFailure,
} from "../../slices/coupon/couponDeleteSlice";
import {
  fetchCouponDetailStart,
  fetchCouponDetailSuccess,
  fetchCouponDetailFailure,
} from "../../slices/coupon/couponDetailSlice";
import {
  createCouponStart,
  createCouponSuccess,
  createCouponFailure,
} from "../../slices/coupon/couponCreateSlice";
import {
  updateCouponStart,
  updateCouponSuccess,
  updateCouponFailure,
} from "../../slices/coupon/couponUpdateSlice";

import {
  setCouponStatusRequest,
  setCouponStatusSuccess,
  setCouponStatusFailure,
} from "../../slices/coupon/couponSetStatusSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponDetailType,
  CouponCreateRequest,
  CouponUpdateRequest,
  SetCouponStatusResponse,
} from "../../../type/coupon/coupon";
import type { SetCouponStatusRequestPayload } from "../../slices/coupon/couponSetStatusSlice";

import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import type { AxiosResponse } from "axios";
import {
  fetchCouponsValidFailure,
  fetchCouponsValidStart,
  fetchCouponsValidSuccess,
} from "../../slices/coupon/couponListValidSlice";
import { withGlobalLoading } from "../../../utils/globalLoading/withGlobalLoading";
import menuItemService from "../../../services/menuItemService";
import { objectMapper } from "../../../helper/mapperObject";
import { fieldMap } from "../../../utils/objectMapper/menuItem";
import type { MenuListDataType } from "../../../type/menu/menu";
import promotionService from "../../../services/promotionService";
import { fieldMapPromotion } from "../../../utils/objectMapper/promotion";
import type { PromotionListDataType } from "../../../type/promotion/promotion";

interface ApiError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

const { getListValidCoupon, getCouponList } = couponService;
const { getListMenuItemsIds } = menuItemService;
const { getPromotionDetail } = promotionService;

function* handleFetchCoupons(
  action: PayloadAction<ListPageParams | undefined>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(
      getCouponList,
      action.payload as ListPageParams
    );
    yield put(fetchCouponsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(fetchCouponsFailure(err as string));
  }
}

function* handleFetchCouponsVadlid(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(getListValidCoupon, action.payload);
    yield put(
      fetchCouponsValidSuccess({
        coupons: response.data.items,
        total: response.data.total_count,
      })
    );
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(fetchCouponsValidFailure(err as string));
  }
}

function* handleFetchCouponDetail(
  action: PayloadAction<{ storeId: string; couponId: string }>
): Generator<Effect, void, CouponDetailType> {
  try {
    const { couponId } = action.payload;
    const response = yield call(getCouponDetail, couponId);
    let dataResponse = response;
    if (response?.accept_for_items && response?.accept_for_items.length > 0) {
      const responseMenuItems = yield call(() =>
        getListMenuItemsIds(response?.accept_for_items as string[])
      );

      const dataMappedMenuItems = objectMapper(
        Array.isArray(responseMenuItems.data)
          ? responseMenuItems.data
          : [responseMenuItems.data],
        fieldMap
      );

      console.log("dataMappedMenuItems", dataMappedMenuItems);

      dataResponse = {
        ...dataResponse,
        accept_for_items_list: dataMappedMenuItems as MenuListDataType[],
      };
    }

    if (response?.promotion_id) {
      const responsePromotion = yield call(() =>
        getPromotionDetail(response?.promotion_id)
      );
      const dataMappedPromotion = objectMapper(
        Array.isArray(responsePromotion.data)
          ? responsePromotion.data
          : [responsePromotion.data],
        fieldMapPromotion
      );

      dataResponse = {
        ...dataResponse,
        promotion: dataMappedPromotion as PromotionListDataType[],
      };
    }

    console.log("dataResponse", dataResponse);
    yield put(fetchCouponDetailSuccess(dataResponse));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(fetchCouponDetailFailure(err as string));
  }
}

function* handleCreateCoupon(
  action: PayloadAction<{ couponData: CouponCreateRequest; storeId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { couponData } = action.payload;
    const response = yield call(createCoupon, couponData);
    yield put(createCouponSuccess(response as Record<string, unknown>));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(createCouponFailure(err as string));
  }
}

function* handleUpdateCoupon(
  action: PayloadAction<{ couponId: string; couponData: CouponUpdateRequest }>
): Generator<unknown, void, unknown> {
  try {
    const { couponId, couponData } = action.payload;

    const response = yield call(updateCoupon, couponId, couponData);
    yield put(updateCouponSuccess(response as Record<string, unknown>));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(updateCouponFailure(err as string));
  }
}

function* handleDeleteCoupon(
  action: PayloadAction<{ couponId: string }>
): Generator<unknown, void, unknown> {
  try {
    const { couponId } = action.payload;

    yield call(deleteCoupon, couponId);
    yield put(deleteCouponSuccess({ couponId }));
  } catch (error: unknown) {
    const err = error as ApiError;

    yield put(deleteCouponFailure(err as string));
  }
}

function* handleSetCouponStatus(
  action: PayloadAction<SetCouponStatusRequestPayload>
): Generator<unknown, void, unknown> {
  try {
    const { couponId, isActive } = action.payload;

    const response = yield call(setCouponStatus, couponId, isActive);

    yield put(
      setCouponStatusSuccess({
        response: response as SetCouponStatusResponse,
        couponId,
      })
    );
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(setCouponStatusFailure({ error: err as string }));
  }
}

export default function* couponSaga() {
  yield all([
    takeLatest(fetchCouponsStart.type, handleFetchCoupons),
    takeLatest(fetchCouponDetailStart.type, function* (action) {
      yield* withGlobalLoading(handleFetchCouponDetail, action);
    }),
    takeLatest(createCouponStart.type, function* (action) {
      yield* withGlobalLoading(handleCreateCoupon, action);
    }),
    takeLatest(updateCouponStart.type, handleUpdateCoupon),
    takeLatest(deleteCouponStart.type, handleDeleteCoupon),
    takeLatest(setCouponStatusRequest.type, function* (action) {
      yield* withGlobalLoading(handleSetCouponStatus, action);
    }),
    takeLatest(fetchCouponsValidStart.type, handleFetchCouponsVadlid),
  ]);
}
