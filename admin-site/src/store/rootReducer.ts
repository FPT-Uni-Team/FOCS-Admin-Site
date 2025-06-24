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

});

export default rootReducer;