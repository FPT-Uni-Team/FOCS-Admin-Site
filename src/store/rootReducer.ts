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
import variantGroupDetailSlice from "./slices/variant/variantGroupDetailSlice";
import variantGroupUpdateSlice from "./slices/variant/variantGroupUpdateSlice";
import variantGroupCreateSlice from "./slices/variant/variantGroupCreateSlice";
import variantListSlice from "./slices/variant/variantListSlice";
import variantDetailSlice from "./slices/variant/variantDetailSlice";
import variantUpdateSlice from "./slices/variant/variantUpdateSlice";
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
import tableListSlice from "./slices/table/tableListSlice";
import tableDetailSlice from "./slices/table/tableDetailSlice";
import tableCreateSlice from "./slices/table/tableCreateSlice";
import tableUpdateSlice from "./slices/table/tableUpdateSlice";
import tableChangeStatusSlice from "./slices/table/tableChangeStatusSlice";
import orderListSlice from "./slices/order/orderListSlice";
import orderDetailSlice from "./slices/order/orderDetailSlice";
import feedbackListSlice from "./slices/feedback/feedbackListSlice";

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
  variantGroupDetail: variantGroupDetailSlice,
  variantGroupUpdate: variantGroupUpdateSlice,
  variantGroupCreate: variantGroupCreateSlice,
  variantList: variantListSlice,
  variantDetail: variantDetailSlice,
  variantUpdate: variantUpdateSlice,
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
  tableList: tableListSlice,
  tableDetail: tableDetailSlice,
  tableCreate: tableCreateSlice,
  tableUpdate: tableUpdateSlice,
  changeTableStatus: tableChangeStatusSlice,
  orderList: orderListSlice,
  orderDetail: orderDetailSlice,
  feedbackList: feedbackListSlice,
});

export default rootReducer;
