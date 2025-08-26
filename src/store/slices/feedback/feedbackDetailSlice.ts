import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";

interface FeedbackDetailState {
  feedback: FeedbackListDataType | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackDetailState = {
  feedback: null,
  loading: false,
  error: null,
};

const feedbackDetailSlice = createSlice({
  name: "feedbackDetail",
  initialState,
  reducers: {
    fetchFeedbackDetailStart: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<{ feedbackId: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeedbackDetailSuccess: (
      state,
      action: PayloadAction<FeedbackListDataType>
    ) => {
      state.loading = false;
      state.feedback = action.payload;
      state.error = null;
    },
    fetchFeedbackDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.feedback = null;
    },
    clearFeedbackDetail: (state) => {
      state.feedback = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  fetchFeedbackDetailStart,
  fetchFeedbackDetailSuccess,
  fetchFeedbackDetailFailure,
  clearFeedbackDetail,
} = feedbackDetailSlice.actions;
export default feedbackDetailSlice.reducer;
