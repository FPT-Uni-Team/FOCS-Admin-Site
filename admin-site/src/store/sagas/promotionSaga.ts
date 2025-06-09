/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchPromotionsFailure,
  fetchPromotionsStart,
  fetchPromotionsSuccess,
} from "../slices/promotionSlice";

function* fetchUsers() {
  try {
    const response: any = yield call(
      fetch,
      "https://jsonplaceholder.typicode.com/users"
    );
    const users = yield call([response, "json"]);
    yield put(fetchPromotionsSuccess(users));
  } catch (error: any) {
    yield put(fetchPromotionsFailure("Failed to fetch users"));
  }
}

export function* watchPromotionSaga() {
  yield takeEvery(fetchPromotionsStart.type, fetchUsers);
}
