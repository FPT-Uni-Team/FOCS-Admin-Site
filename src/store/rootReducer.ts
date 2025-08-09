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
import promotionDeleteSlice from "./slices/promotion/promotionDeleteSlice";
import changeStatusPromotionSlice from "./slices/promotion/promotionChangeStatusSlice";
import categoryListSlice from "./slices/category/categoryListSlice";
import variantGroupSlice from "./slices/variant/variantGroupSlice";
import variantGroupDetailSlice from "./slices/variant/variantGroupDetailSlice";
import variantGroupUpdateSlice from "./slices/variant/variantGroupUpdateSlice";
import variantGroupCreateSlice from "./slices/variant/variantGroupCreateSlice";
import variantGroupDeleteSlice from "./slices/variant/variantGroupDeleteSlice";
import variantDeleteSlice from "./slices/variant/variantDeleteSlice";
import variantListSlice from "./slices/variant/variantListSlice";
import variantDetailSlice from "./slices/variant/variantDetailSlice";
import variantUpdateSlice from "./slices/variant/variantUpdateSlice";
import variantCreateSlice from "./slices/variant/variantCreateSlice";
import variantAssignSlice from "./slices/variant/variantAssignSlice";
import menuItemCreateSlice from "./slices/menuItem/menuItemCreateSlice";
import menuItemDetailSlice from "./slices/menuItem/menuItemDetailSlice";
import menuItemDeleteSlice from "./slices/menuItem/menuItemDeleteSlice";
import categoryCreateSlice from "./slices/category/categoryCreateSlice";
import categoryDetailSlice from "./slices/category/categoryDetailSlice";
import changeCategoryStatusSlice from "./slices/category/categoryChangeStatusSlice";
import categoryUpdateSlice from "./slices/category/categoryUpdateSlice";
import categoryDeleteSlice from "./slices/category/categoryDeleteSlice";
import staffListSlice from "./slices/staff/staffListSlice";
import menuItemUpdateSlice from "./slices/menuItem/menuItemUpdateSlice";
import staffCreateSlice from "./slices/staff/staffCreateSlice";
import staffDetailSlice from "./slices/staff/staffDetailSlice";
import staffUpdateSlice from "./slices/staff/staffUpdateSlice";
import staffDeleteSlice from "./slices/staff/staffDeleteSlice";
import tableListSlice from "./slices/table/tableListSlice";
import tableDetailSlice from "./slices/table/tableDetailSlice";
import tableCreateSlice from "./slices/table/tableCreateSlice";
import tableUpdateSlice from "./slices/table/tableUpdateSlice";
import tableChangeStatusSlice from "./slices/table/tableChangeStatusSlice";
import tableDeleteSlice from "./slices/table/tableDeleteSlice";
import orderListSlice from "./slices/order/orderListSlice";
import orderDetailSlice from "./slices/order/orderDetailSlice";
import feedbackListSlice from "./slices/feedback/feedbackListSlice";
import feedbackDetailSlice from "./slices/feedback/feedbackDetailSlice";
import feedbackUpdateSlice from "./slices/feedback/feedbackUpdateSlice";
import workshiftListSlice from "./slices/workshift/workshiftListSlice";
import workshiftDetailSlice from "./slices/workshift/workshiftDetailSlice";
import workshiftCreateSlice from "./slices/workshift/workshiftCreateSlice";
import workshiftDeleteSlice from "./slices/workshift/workshiftDeleteSlice";
import breadcrumbSlice from "./slices/breadcumb/breadcrumbSlice";

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
  promotionDelete: promotionDeleteSlice,
  changeStatusPromotion: changeStatusPromotionSlice,
  categoryList: categoryListSlice,
  variantGroup: variantGroupSlice,
  variantGroupDetail: variantGroupDetailSlice,
  variantGroupUpdate: variantGroupUpdateSlice,
  variantGroupCreate: variantGroupCreateSlice,
  variantGroupDelete: variantGroupDeleteSlice,
  variantDelete: variantDeleteSlice,
  variantList: variantListSlice,
  variantDetail: variantDetailSlice,
  variantUpdate: variantUpdateSlice,
  variantCreate: variantCreateSlice,
  variantAssign: variantAssignSlice,
  menuItemCreate: menuItemCreateSlice,
  menuItemDetail: menuItemDetailSlice,
  menuItemDelete: menuItemDeleteSlice,
  categoryCreate: categoryCreateSlice,
  categoryDetail: categoryDetailSlice,
  changeCategoryStatus: changeCategoryStatusSlice,
  categoryUpdate: categoryUpdateSlice,
  categoryDelete: categoryDeleteSlice,
  staffList: staffListSlice,
  menuItemUpdate: menuItemUpdateSlice,
  staffCreate: staffCreateSlice,
  staffDetail: staffDetailSlice,
  staffUpdate: staffUpdateSlice,
  staffDelete: staffDeleteSlice,
  tableList: tableListSlice,
  tableDetail: tableDetailSlice,
  tableCreate: tableCreateSlice,
  tableUpdate: tableUpdateSlice,
  changeTableStatus: tableChangeStatusSlice,
  tableDelete: tableDeleteSlice,
  orderList: orderListSlice,
  orderDetail: orderDetailSlice,
  feedbackList: feedbackListSlice,
  feedbackDetail: feedbackDetailSlice,
  feedbackUpdate: feedbackUpdateSlice,
  workshiftList: workshiftListSlice,
  workshiftDetail: workshiftDetailSlice,
  workshiftCreate: workshiftCreateSlice,
  workshiftDelete: workshiftDeleteSlice,
  breadcrumb: breadcrumbSlice,
});

export default rootReducer;
