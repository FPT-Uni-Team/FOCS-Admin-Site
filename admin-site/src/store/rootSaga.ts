import { all, fork } from "redux-saga/effects";
import { watchPromotionSaga } from "./sagas/promotionSaga";

export default function* rootSaga() {
  yield all([
    fork(watchPromotionSaga),
    // Thêm các saga khác ở đây
  ]);
}
