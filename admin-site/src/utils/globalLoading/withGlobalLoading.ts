/* eslint-disable @typescript-eslint/no-explicit-any */
import { put } from "redux-saga/effects";
import {
  hideLoading,
  showLoading,
} from "../../store/slices/loading/loadingSlice";

export function* withGlobalLoading(saga: any, ...args: any) {
  try {
    yield put(showLoading());
    yield* saga(...args);
  } finally {
    yield put(hideLoading());
  }
}
