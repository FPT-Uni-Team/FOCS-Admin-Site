import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotion/promotionSaga";
import authSaga from "./sagas/auth/authSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    fork(authSaga),
    // Thêm các saga khác ở đây
  ]);
}
