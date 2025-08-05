import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ListPageParams } from "../../../type/common/common";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";

interface FeedbackListState {
  feedbacks: FeedbackListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

const initialState: FeedbackListState = {
  feedbacks: [],
  loading: false,
  error: null,
  params: {
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  },
  total: 0,
};

const feedbackListSlice = createSlice({
  name: "feedbackList",
  initialState,
  reducers: {
    fetchFeedbacksStart: (
      state,
      action: PayloadAction<ListPageParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchFeedbacksSuccess: (
      state,
      action: PayloadAction<{
        feedbacks: FeedbackListDataType[];
        total: number;
      }>
    ) => {
      state.loading = false;
      state.feedbacks = action.payload.feedbacks;
      state.error = null;
      state.total = action.payload.total;
    },
    fetchFeedbacksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.feedbacks = [];
      state.total = 0;
    },
  },
});

export const {
  fetchFeedbacksStart,
  fetchFeedbacksSuccess,
  fetchFeedbacksFailure,
} = feedbackListSlice.actions;
export default feedbackListSlice.reducer;