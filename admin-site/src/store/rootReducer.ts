import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";
import authReducer from "./slices/auth/authSlice";
import menuItemSlice from "./slices/menuItem/menuItemSlice";
import promotionCreateSlice from "./slices/promotion/promotionCreateSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
  auth: authReducer,
  menuItem: menuItemSlice,
  createPromotion: promotionCreateSlice,
});

export default rootReducer;
