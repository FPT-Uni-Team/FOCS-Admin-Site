import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import type {
  ListPageParams,
  ListPageResponse,
} from "../../../type/common/common";
import {
  fetchFeedbacksFailure,
  fetchFeedbacksStart,
  fetchFeedbacksSuccess,
} from "../../slices/feedback/feedbackListSlice";
import feedbackService from "../../../services/feedbackService";

const { getListFeedback } = feedbackService;

function* fetchFeedbackList(
  action: PayloadAction<ListPageParams>
): Generator<Effect, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(() => getListFeedback(action.payload));
    const total = response.data.total_count;
    yield put(
      fetchFeedbacksSuccess({ feedbacks: response.data.items, total: total })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch feedbacks";
    yield put(fetchFeedbacksFailure(errorMessage));
  }
}

export function* watchFeedbackSaga() {
  yield takeLatest(fetchFeedbacksStart.type, fetchFeedbackList);
}