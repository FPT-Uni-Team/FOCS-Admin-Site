import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";
import authReducer from "./slices/auth/authSlice";
import couponListSlice from "./slices/coupon/couponListSlice";
import couponDetailSlice from "./slices/coupon/couponDetailSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
  auth: authReducer,
  couponList: couponListSlice,
  couponDetail: couponDetailSlice,
});

export default rootReducer;
