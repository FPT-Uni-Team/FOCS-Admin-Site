import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotion/promotionSaga";
import authSaga from "./sagas/auth/authSaga";

import couponSaga from "./sagas/coupon/couponSaga";

import { watchMenuSaga } from "./sagas/menu/menuItemSaga";
import { watchCategorySaga } from "./sagas/category/categorySaga";
import { watchVariantSaga } from "./sagas/variant/variantSaga";
import { watchStaffSaga } from "./sagas/staff/staffSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    fork(authSaga),
    fork(couponSaga),
    fork(watchMenuSaga),
    fork(watchCategorySaga),
    fork(watchVariantSaga),
    fork(watchStaffSaga),
    // add saga
  ]);
}
