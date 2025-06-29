import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";
import authReducer from "./slices/auth/authSlice";
import couponListReducer from "./slices/coupon/couponListSlice";
import couponDetailReducer from "./slices/coupon/couponDetailSlice";
import couponCreateReducer from "./slices/coupon/couponCreateSlice";
import couponUpdateReducer from "./slices/coupon/couponUpdateSlice";
import couponDeleteReducer from "./slices/coupon/couponDeleteSlice";
import couponTrackUsageReducer from "./slices/coupon/couponTrackUsageSlice";
import couponSetStatusReducer from "./slices/coupon/couponSetStatusSlice";
import couponAssignReducer from "./slices/coupon/couponAssignSlice";
import menuItemSlice from "./slices/menuItem/menuItemSlice";
import promotionCreateSlice from "./slices/promotion/promotionCreateSlice";
import loadingSlice from "./slices/loading/loadingSlice";
import promotionDetailSlice from "./slices/promotion/promotionDetailSlice";
import couponListValidSlice from "./slices/coupon/couponListValidSlice";
import promotionUpdateSlice from "./slices/promotion/promotionUpdateSlice";
import changeStatusPromotionSlice from "./slices/promotion/promotionChangeStatusSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
  auth: authReducer,
  couponList: couponListReducer,
  couponDetail: couponDetailReducer,
  couponCreate: couponCreateReducer,
  couponUpdate: couponUpdateReducer,
  couponDelete: couponDeleteReducer,
  couponTrackUsage: couponTrackUsageReducer,
  couponSetStatus: couponSetStatusReducer,
  couponAssign: couponAssignReducer,
  menuItem: menuItemSlice,
  createPromotion: promotionCreateSlice,
  loadingGlobal: loadingSlice,
  promotionDetail: promotionDetailSlice,
  couponValid: couponListValidSlice,
  promotionUpdate: promotionUpdateSlice,
  changeStatusPromotion: changeStatusPromotionSlice,
});

export default rootReducer;
