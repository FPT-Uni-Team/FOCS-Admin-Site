import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";
import authReducer from "./slices/auth/authSlice";
import couponListReducer from "./slices/coupon/couponListSlice";
import couponDetailReducer from "./slices/coupon/couponDetailSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
  auth: authReducer,
  couponList: couponListReducer,
  couponDetail: couponDetailReducer,
});

export default rootReducer;
