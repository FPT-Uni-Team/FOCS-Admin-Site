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
  [PromotionType.Percentage]: "Giảm theo phần trăm",
  [PromotionType.FixedAmount]: "Giảm số tiền cố định",
  [PromotionType.FreeItem]: "Tặng sản phẩm",
  [PromotionType.FreeShipping]: "Miễn phí vận chuyển",
  [PromotionType.BuyXGetY]: "Mua X tặng Y",
  [PromotionType.TimeBased]: "Khuyến mãi theo khung giờ",
  [PromotionType.FirstTimeBuyer]: "Dành cho khách hàng lần đầu",
  [PromotionType.Loyalty]: "Khuyến mãi khách hàng thân thiết",
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
