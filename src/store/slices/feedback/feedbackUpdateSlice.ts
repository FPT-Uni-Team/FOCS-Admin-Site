import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FeedbackUpdateRequest } from "../../../type/feedback/feedback";

interface FeedbackUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: FeedbackUpdateState = {
  loading: false,
  success: false,
  error: null,
};

const feedbackUpdateSlice = createSlice({
  name: "feedbackUpdate",
  initialState,
  reducers: {
    updateFeedbackStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: { feedbackId: string; payload: FeedbackUpdateRequest }) => ({ payload }),
    },
    updateFeedbackSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    updateFeedbackFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetUpdateFeedback: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  updateFeedbackStart,
  updateFeedbackSuccess,
  updateFeedbackFailure,
  resetUpdateFeedback,
} = feedbackUpdateSlice.actions;

export default feedbackUpdateSlice.reducer;