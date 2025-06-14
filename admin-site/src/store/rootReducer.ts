import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";
import authReducer from "./slices/auth/authSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
  auth: authReducer,
});

export default rootReducer;
