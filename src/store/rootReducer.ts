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
import menuItemSlice from "./slices/menuItem/menuItemSlice";
import promotionCreateSlice from "./slices/promotion/promotionCreateSlice";
import loadingSlice from "./slices/loading/loadingSlice";
import promotionDetailSlice from "./slices/promotion/promotionDetailSlice";
import couponListValidSlice from "./slices/coupon/couponListValidSlice";
import promotionUpdateSlice from "./slices/promotion/promotionUpdateSlice";
import changeStatusPromotionSlice from "./slices/promotion/promotionChangeStatusSlice";
import categoryListSlice from "./slices/category/categoryListSlice";
import variantGroupSlice from "./slices/variant/variantGroupSlice";
import menuItemCreateSlice from "./slices/menuItem/menuItemCreateSlice";
import menuItemDetailSlice from "./slices/menuItem/menuItemDetailSlice";
import categoryCreateSlice from "./slices/category/categoryCreateSlice";
import categoryDetailSlice from "./slices/category/categoryDetailSlice";
import changeCategoryStatusSlice from "./slices/category/categoryChangeStatusSlice";
import categoryUpdateSlice from "./slices/category/categoryUpdateSlice";
import staffListSlice from "./slices/staff/staffListSlice";
import menuItemUpdateSlice from "./slices/menuItem/menuItemUpdateSlice";
import staffCreateSlice from "./slices/staff/staffCreateSlice";
import staffDetailSlice from "./slices/staff/staffDetailSlice";
import staffUpdateSlice from "./slices/staff/staffUpdateSlice";

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
  menuItem: menuItemSlice,
  createPromotion: promotionCreateSlice,
  loadingGlobal: loadingSlice,
  promotionDetail: promotionDetailSlice,
  couponValid: couponListValidSlice,
  promotionUpdate: promotionUpdateSlice,
  changeStatusPromotion: changeStatusPromotionSlice,
  categoryList: categoryListSlice,
  variantGroup: variantGroupSlice,
  menuItemCreate: menuItemCreateSlice,
  menuItemDetail: menuItemDetailSlice,
  categoryCreate: categoryCreateSlice,
  categoryDetail: categoryDetailSlice,
  changeCategoryStatus: changeCategoryStatusSlice,
  categoryUpdate: categoryUpdateSlice,
  staffList: staffListSlice,
  menuItemUpdate: menuItemUpdateSlice,
  staffCreate: staffCreateSlice,
  staffDetail: staffDetailSlice,
  staffUpdate: staffUpdateSlice,
});

export default rootReducer;
