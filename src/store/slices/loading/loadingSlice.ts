import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  count: number;
}

const initialState: LoadingState = {
  count: 0,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.count += 1;
    },
    hideLoading: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
