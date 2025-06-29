import {
  call,
  put,
  takeLatest,
  takeEvery,
  all,
  type Effect,
} from "redux-saga/effects";
import {
  getCouponList,
  getCouponDetail,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  trackCouponUsage,
  setCouponStatus,
  assignCouponsToPromotion,
  couponService,
} from "../../../services/couponService";
import {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  addNewCouponToList,
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
  trackUsageRequest,
  trackUsageSuccess,
  trackUsageFailure,
} from "../../slices/coupon/couponTrackUsageSlice";
import {
  setCouponStatusRequest,
  setCouponStatusSuccess,
  setCouponStatusFailure,
} from "../../slices/coupon/couponSetStatusSlice";
import type { TrackUsageRequestPayload } from "../../slices/coupon/couponTrackUsageSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponListParams,
  CouponListResponse,
  CouponDetailType,
  CouponCreateRequest,
  CouponUpdateRequest,
  CouponStatus,
  SetCouponStatusResponse,
  TrackCouponUsageResponse,
  CouponAssignRequest,
  CouponAssignResponse,
} from "../../../type/coupon/coupon";
import type { SetCouponStatusRequestPayload } from "../../slices/coupon/couponSetStatusSlice";
import {
  assignCouponsStart,
  assignCouponsSuccess,
  assignCouponsFailure,
} from "../../slices/coupon/couponAssignSlice";
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

const { getListValidCoupon } = couponService;
const { getListMenuItemsIds } = menuItemService;
const { getPromotionDetail } = promotionService;

function* handleFetchCoupons(
  action: PayloadAction<CouponListParams | undefined>
) {
  try {
    const params = action.payload || {
      page: 1,
      page_size: 10,
    };

    const response: CouponListResponse = yield call(getCouponList, params);
    yield put(fetchCouponsSuccess(response));
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
    console.log("dataResponse", response);
    let dataResponse = response;
    if (response?.accept_for_items && response?.accept_for_items.length > 0) {
      const responseMenuItems = yield call(() =>
        getListMenuItemsIds(response?.accept_for_items as string[])
      );
      const dataMappedMenuItems = objectMapper(
        Array.isArray(responseMenuItems)
          ? responseMenuItems
          : [responseMenuItems],
        fieldMap
      );

      dataResponse = {
        ...dataResponse,
        accept_for_items_list: dataMappedMenuItems as MenuListDataType[],
      };
    }

    if (response?.promotion_id) {
      const responsePromotion = yield call(() =>
        getPromotionDetail(response?.promotion_id)
      );
      const dataMappedMenuItems = objectMapper(
        Array.isArray(responsePromotion.data)
          ? responsePromotion.data
          : [responsePromotion.data],
        fieldMapPromotion
      );

      dataResponse = {
        ...dataResponse,
        promotion: dataMappedMenuItems as PromotionListDataType[],
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

    const now = new Date();
    const startDate = new Date(couponData.start_date);
    const endDate = new Date(couponData.end_date);

    let status: CouponStatus = 2;
    if (now < startDate) {
      status = 1;
    } else if (now > endDate) {
      status = 3;
    }

    const responseData = response as {
      id?: string;
      coupon_id?: string;
      [key: string]: unknown;
    };
    const newCouponForList = {
      id: responseData?.id || responseData?.coupon_id || `temp-${Date.now()}`,
      code: couponData.code || `AUTO-${Date.now()}`,
      description: couponData.description,
      discount_type: couponData.discount_type,
      value: couponData.value,
      start_date: couponData.start_date,
      end_date: couponData.end_date,
      max_usage: couponData.max_usage,
      count_used: 0,
      is_active: couponData.is_active,
      status: status,
    };

    yield put(addNewCouponToList(newCouponForList));

    yield put(
      fetchCouponsStart({
        page: 1,
        page_size: 10,
      })
    );
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

    yield put(fetchCouponDetailStart({ storeId: "", couponId }));

    yield put(
      fetchCouponsStart({
        page: 1,
        page_size: 10,
      })
    );
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

    yield put(
      fetchCouponsStart({
        page: 1,
        page_size: 10,
      })
    );
  } catch (error: unknown) {
    const err = error as ApiError;

    yield put(deleteCouponFailure(err as string));
  }
}

function* handleTrackCouponUsage(
  action: PayloadAction<TrackUsageRequestPayload>
): Generator<unknown, void, unknown> {
  try {
    const { couponId, userId } = action.payload;

    const response = yield call(trackCouponUsage, couponId, userId);

    yield put(trackUsageSuccess(response as TrackCouponUsageResponse));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to preview coupon usage";
    yield put(trackUsageFailure(errorMessage));
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

    yield put(
      fetchCouponsStart({
        page: 1,
        page_size: 10,
      })
    );
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(setCouponStatusFailure({ error: err as string }));
  }
}

function* handleAssignCoupons(
  action: PayloadAction<{ storeId: string; assignRequest: CouponAssignRequest }>
): Generator<unknown, void, unknown> {
  try {
    const { storeId, assignRequest } = action.payload;

    const response = yield call(
      assignCouponsToPromotion,
      storeId,
      assignRequest
    );

    yield put(assignCouponsSuccess(response as CouponAssignResponse));

    yield put(
      fetchCouponsStart({
        page: 1,
        page_size: 10,
      })
    );
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(assignCouponsFailure(err as string));
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
    takeEvery(trackUsageRequest.type, handleTrackCouponUsage),
    takeLatest(setCouponStatusRequest.type, function* (action) {
      yield* withGlobalLoading(handleSetCouponStatus, action);
    }),
    takeLatest(assignCouponsStart.type, handleAssignCoupons),
    takeLatest(fetchCouponsValidStart.type, handleFetchCouponsVadlid),
  ]);
}
