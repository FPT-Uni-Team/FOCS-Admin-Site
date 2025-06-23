export const PromotionType = {
  Percentage: 0,
  FixedAmount: 1,
  FreeItem: 2,
  FreeShipping: 3,
  BuyXGetY: 4,
  TimeBased: 5,
  FirstTimeBuyer: 6,
  Loyalty: 7,
} as const;

export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType];

export interface PromotionListDataType {
  promotionName: string;
  promotionStartDate: string;
  promotionEndDate: string;
  promotionType: PromotionType;
  promotionStatus: string;
}

export const PromotionTypeLabel: Record<PromotionType, string> = {
  [PromotionType.Percentage]: "Percentage Discount",
  [PromotionType.FixedAmount]: "Fixed Amount Discount",
  [PromotionType.FreeItem]: "Free Item",
  [PromotionType.FreeShipping]: "Free Shipping",
  [PromotionType.BuyXGetY]: "Buy X Get Y",
  [PromotionType.TimeBased]: "Time-Based Promotion",
  [PromotionType.FirstTimeBuyer]: "First Time Buyer",
  [PromotionType.Loyalty]: "Loyalty Promotion",
};

export interface PromotionListParams {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  filters?: Record<string, string>;
}
