import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotion/promotionSaga";
import authSaga from "./sagas/auth/authSaga";
import { watchMenuSaga } from "./sagas/menu/menuItemSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    fork(authSaga),
    fork(watchMenuSaga),
    // add saga
  ]);
}
