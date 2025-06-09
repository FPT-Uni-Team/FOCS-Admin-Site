import { combineReducers } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotionSlice";

const rootReducer = combineReducers({
  promotion: promotionSlice,
});

export default rootReducer;
