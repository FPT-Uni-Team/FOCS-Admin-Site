import { call, put, takeLatest } from 'redux-saga/effects';
import { getCouponList, getCouponDetail } from '../../../services/couponService';
import {
  fetchCouponsStart,
  fetchCouponsSuccess,
  fetchCouponsFailure,
} from '../../slices/coupon/couponListSlice';
import {
  fetchCouponDetailStart,
  fetchCouponDetailSuccess,
  fetchCouponDetailFailure,
} from '../../slices/coupon/couponDetailSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CouponListParams, CouponListResponse, CouponDetailType } from '../../../type/coupon/coupon';

interface ApiError {
  message?: string;
}

function* handleFetchCoupons(action: PayloadAction<CouponListParams | undefined>) {
  try {
    const params = action.payload || {
      page: 1,
      page_size: 10,
    };
    
    console.log('Fetching coupons with params:', params);
    const response: CouponListResponse = yield call(getCouponList, params);
    console.log('Coupon list response:', response);
    yield put(fetchCouponsSuccess(response));
  } catch (error: unknown) {
    console.error('Error fetching coupons:', error);
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch coupons';
    yield put(fetchCouponsFailure(errorMessage));
  }
}

function* handleFetchCouponDetail(action: PayloadAction<{ storeId: string; couponId: string }>) {
  try {
    const { couponId } = action.payload;
    const requestData = {}; // Có thể thêm data nếu API cần
    const response: CouponDetailType = yield call(getCouponDetail, couponId, requestData);
    yield put(fetchCouponDetailSuccess(response));
  } catch (error) {
    const err = error as ApiError;
    yield put(fetchCouponDetailFailure(err.message || 'Failed to fetch coupon detail'));
  }
}

export function* watchCouponSaga() {
  yield takeLatest(fetchCouponsStart.type, handleFetchCoupons);
  yield takeLatest(fetchCouponDetailStart.type, handleFetchCouponDetail);
} 