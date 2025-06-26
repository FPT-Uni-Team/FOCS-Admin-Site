import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotion/promotionSaga";
import authSaga from "./sagas/auth/authSaga";

import couponSaga from "./sagas/coupon/couponSaga";

import { watchMenuSaga } from "./sagas/menu/menuItemSaga";
import { watchMenuItemSaga } from "./sagas/menuItem/menuItemSaga";
import { watchMenuItemCreateSaga } from "./sagas/menuItem/menuItemCreateSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    fork(authSaga),
    fork(couponSaga),
    fork(watchMenuSaga),
    fork(watchMenuItemSaga),
    fork(watchMenuItemCreateSaga),
    // add saga
  ]);
}
