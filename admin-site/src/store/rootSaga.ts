import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotion/promotionSaga";
import authSaga from "./sagas/auth/authSaga";
import { watchCouponSaga } from "./sagas/coupon/couponSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    fork(authSaga),
    fork(watchCouponSaga),
    // Thêm các saga khác ở đây
  ]);
}
