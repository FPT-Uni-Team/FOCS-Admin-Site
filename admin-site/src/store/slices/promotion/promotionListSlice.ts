import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  PromotionListDataType,
  PromotionListParams,
} from "../../../type/promotion/promotion";

interface PromotionListState {
  promotions: PromotionListDataType[];
  loading: boolean;
  error: string | null;
  params: PromotionListParams;
  total: number;
}

const initialState: PromotionListState = {
  promotions: [],
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

const promotionSlice = createSlice({
  name: "promotionList",
  initialState,
  reducers: {
    fetchPromotionsStart: (
      state,
      action: PayloadAction<PromotionListParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      state.params = action.payload || initialState.params;
    },
    fetchPromotionsSuccess: (
      state,
      action: PayloadAction<PromotionListDataType[]>
    ) => {
      state.loading = false;
      state.promotions = action.payload;
    },
    fetchPromotionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPromotionsStart,
  fetchPromotionsSuccess,
  fetchPromotionsFailure,
} = promotionSlice.actions;
export default promotionSlice.reducer;
