import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { getCouponList, getCouponDetail, createCoupon, updateCoupon, deleteCoupon, trackCouponUsage, setCouponStatus, assignCouponsToPromotion } from '../../../services/couponService';
import {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  addNewCouponToList,
} from '../../slices/coupon/couponListSlice';
import {
  deleteCouponStart,
  deleteCouponSuccess,
  deleteCouponFailure,
} from '../../slices/coupon/couponDeleteSlice';
import {
  fetchCouponDetailStart,
  fetchCouponDetailSuccess,
  fetchCouponDetailFailure,
} from '../../slices/coupon/couponDetailSlice';
import {
  createCouponStart,
  createCouponSuccess,
  createCouponFailure,
} from '../../slices/coupon/couponCreateSlice';
import {
  updateCouponStart,
  updateCouponSuccess,
  updateCouponFailure,
} from '../../slices/coupon/couponUpdateSlice';
import {
  trackUsageRequest,
  trackUsageSuccess,
  trackUsageFailure,
} from '../../slices/coupon/couponTrackUsageSlice';
import {
  setCouponStatusRequest,
  setCouponStatusSuccess,
  setCouponStatusFailure,
} from '../../slices/coupon/couponSetStatusSlice';
import type { TrackUsageRequestPayload } from '../../slices/coupon/couponTrackUsageSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
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
  CouponAssignResponse
} from '../../../type/coupon/coupon';
import type { SetCouponStatusRequestPayload } from '../../slices/coupon/couponSetStatusSlice';
import {
  assignCouponsStart,
  assignCouponsSuccess,
  assignCouponsFailure,
} from '../../slices/coupon/couponAssignSlice';

interface ApiError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

function* handleFetchCoupons(action: PayloadAction<CouponListParams | undefined>) {
  try {
    const params = action.payload || {
      page: 1,
      page_size: 10,
    };

    const response: CouponListResponse = yield call(getCouponList, params);
    yield put(fetchCouponsSuccess(response));
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to fetch coupons';
    
    // Handle different types of errors
    if (err?.response?.status === 401) {
      errorMessage = 'Authentication required. Please login again.';
    } else if (err?.response?.status === 400) {
      errorMessage = 'Bad request - Invalid parameters';
    } else if (err?.response?.status === 404) {
      errorMessage = 'API endpoint not found';
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error - Backend is having issues';
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    yield put(fetchCouponsFailure(errorMessage));
  }
}

function* handleFetchCouponDetail(action: PayloadAction<{ storeId: string; couponId: string }>) {
  try {
    const { couponId } = action.payload;
    const response: CouponDetailType = yield call(getCouponDetail, couponId);
    yield put(fetchCouponDetailSuccess(response));
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to fetch coupon detail';
    
    if (err?.response?.status === 401) {
      errorMessage = 'Unauthorized - Please check your authentication';
    } else if (err?.response?.status === 404) {
      errorMessage = 'Coupon not found';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    yield put(fetchCouponDetailFailure(errorMessage));
  }
}

function* handleCreateCoupon(action: PayloadAction<{ couponData: CouponCreateRequest; storeId: string }>): Generator<unknown, void, unknown> {
  try {
    const { couponData } = action.payload;
    const response = yield call(createCoupon, couponData);
    yield put(createCouponSuccess(response as Record<string, unknown>));
    
    // Add the new coupon directly to the list for immediate UI update
    const now = new Date();
    const startDate = new Date(couponData.start_date);
    const endDate = new Date(couponData.end_date);
    
    let status: CouponStatus = 2; // Default to OnGoing
    if (now < startDate) {
      status = 1; // Upcoming
    } else if (now > endDate) {
      status = 3; // Expired
    }

    const responseData = response as { id?: string; coupon_id?: string; [key: string]: unknown };
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
    
    // Also refresh the coupon list to ensure backend sync
    yield put(fetchCouponsStart({
      page: 1,
      page_size: 10,
    }));
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to create coupon';
    
    // Handle specific error cases from the API documentation
    if (err?.response?.status === 400) {
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
    } else if (err?.response?.status === 401) {
      errorMessage = 'User ID cannot be null or empty.';
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error occurred while creating coupon.';
    } else if (err?.message) {
      errorMessage = err.message;
    }

    yield put(createCouponFailure(errorMessage));
  }
}

function* handleUpdateCoupon(action: PayloadAction<{ couponId: string; couponData: CouponUpdateRequest }>): Generator<unknown, void, unknown> {
  try {
    const { couponId, couponData } = action.payload;
    
    const response = yield call(updateCoupon, couponId, couponData);
    yield put(updateCouponSuccess(response as Record<string, unknown>));
    
    // Refresh the coupon detail to show updated data
    yield put(fetchCouponDetailStart({ storeId: '', couponId }));
    
    // Also refresh the coupon list to ensure consistency
    yield put(fetchCouponsStart({
      page: 1,
      page_size: 10,
    }));
    
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to update coupon';
    
    // Handle specific error cases from the API documentation
    if (err?.response?.status === 400) {
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
    } else if (err?.response?.status === 404) {
      errorMessage = 'Coupon not found';
    } else if (err?.response?.status === 401) {
      errorMessage = 'Unauthorized - Please login again';
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error occurred while updating coupon.';
    } else if (err?.message) {
      errorMessage = err.message;
    }

    yield put(updateCouponFailure(errorMessage));
  }
}

function* handleDeleteCoupon(action: PayloadAction<{ couponId: string }>): Generator<unknown, void, unknown> {
  try {
    const { couponId } = action.payload;
    
    yield call(deleteCoupon, couponId);
    yield put(deleteCouponSuccess({ couponId }));
    
    // Refresh the coupon list to ensure consistency
    yield put(fetchCouponsStart({
      page: 1,
      page_size: 10,
    }));
    
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to delete coupon';
    
    // Handle specific error cases from the API documentation
    if (err?.response?.status === 404) {
      errorMessage = 'Coupon not found or delete unsuccessfully';
    } else if (err?.response?.status === 401) {
      errorMessage = 'Unauthorized - Please login again';
    } else if (err?.response?.status === 400) {
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error occurred while deleting coupon.';
    } else if (err?.message) {
      errorMessage = err.message;
    }

    yield put(deleteCouponFailure(errorMessage));
  }
}

function* handleTrackCouponUsage(action: PayloadAction<TrackUsageRequestPayload>): Generator<unknown, void, unknown> {
  try {
    const { couponId, userId } = action.payload;
    
    const response = yield call(trackCouponUsage, couponId, userId);
    
    yield put(trackUsageSuccess(response as TrackCouponUsageResponse));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to preview coupon usage';
    yield put(trackUsageFailure(errorMessage));
  }
}

function* handleSetCouponStatus(action: PayloadAction<SetCouponStatusRequestPayload>): Generator<unknown, void, unknown> {
  try {
    const { couponId, isActive } = action.payload;
    
    const response = yield call(setCouponStatus, couponId, isActive);
    
    yield put(setCouponStatusSuccess({ 
      response: response as SetCouponStatusResponse, 
      couponId 
    }));
    
    // Refresh the coupon list to show updated status
    yield put(fetchCouponsStart({
      page: 1,
      page_size: 10,
    }));
    
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to set coupon status';
    
    // Handle specific error cases from the API documentation
    if (err?.response?.status === 404) {
      errorMessage = 'Coupon not found or has been deleted.';
    } else if (err?.response?.status === 400) {
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
    } else if (err?.response?.status === 401) {
      errorMessage = 'Unauthorized - Please login again';
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error occurred while setting coupon status.';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    yield put(setCouponStatusFailure({ error: errorMessage }));
  }
}

function* handleAssignCoupons(action: PayloadAction<{ storeId: string; assignRequest: CouponAssignRequest }>): Generator<unknown, void, unknown> {
  try {
    const { storeId, assignRequest } = action.payload;
    
    const response = yield call(assignCouponsToPromotion, storeId, assignRequest);
    
    yield put(assignCouponsSuccess(response as CouponAssignResponse));
    
    // Refresh the coupon list to show updated associations
    yield put(fetchCouponsStart({
      page: 1,
      page_size: 10,
    }));
    
  } catch (error: unknown) {
    const err = error as ApiError;
    
    let errorMessage = 'Failed to assign coupons to promotion';
    
    // Handle specific error cases from the API documentation
    if (err?.response?.status === 404) {
      if (err?.response?.data?.message?.includes('Promotion not found')) {
        errorMessage = 'Promotion not found or deleted.';
      } else {
        errorMessage = err?.response?.data?.message || 'Update unsuccessfully';
      }
    } else if (err?.response?.status === 400) {
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
    } else if (err?.response?.status === 401) {
      errorMessage = 'Unauthorized - Please login again';
    } else if (err?.response?.status === 403) {
      errorMessage = 'You do not have permission to assign promotions for this store.';
    } else if (err?.response?.status === 500) {
      errorMessage = 'Server error occurred while assigning coupons to promotion.';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    yield put(assignCouponsFailure(errorMessage));
  }
}

function* watchFetchCouponList() {
  yield takeLatest(fetchCouponsStart.type, handleFetchCoupons);
}

function* watchFetchCouponDetail() {
  yield takeLatest(fetchCouponDetailStart.type, handleFetchCouponDetail);
}

function* watchCreateCoupon() {
  yield takeLatest(createCouponStart.type, handleCreateCoupon);
}

function* watchUpdateCoupon() {
  yield takeLatest(updateCouponStart.type, handleUpdateCoupon);
}

function* watchDeleteCoupon() {
  yield takeLatest(deleteCouponStart.type, handleDeleteCoupon);
}

function* watchTrackCouponUsage() {
  yield takeEvery(trackUsageRequest.type, handleTrackCouponUsage);
}

function* watchSetCouponStatus() {
  yield takeLatest(setCouponStatusRequest.type, handleSetCouponStatus);
}

function* watchAssignCoupons() {
  yield takeLatest(assignCouponsStart.type, handleAssignCoupons);
}

export default function* couponSaga() {
  yield all([
    watchFetchCouponList(),
    watchCreateCoupon(),
    watchUpdateCoupon(),
    watchDeleteCoupon(),
    watchFetchCouponDetail(),
    watchTrackCouponUsage(),
    watchSetCouponStatus(),
    watchAssignCoupons(),
  ]);
} 