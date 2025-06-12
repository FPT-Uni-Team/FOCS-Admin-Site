import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotion/promotionListSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
});

export default rootReducer;
