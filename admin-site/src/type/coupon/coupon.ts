export const CouponType = {
  Percentage: 0,
  FixedAmount: 1,
  FreeShipping: 2,
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];

export const CouponTypeLabel: Record<CouponType, string> = {
  [CouponType.Percentage]: "Giảm theo phần trăm",
  [CouponType.FixedAmount]: "Giảm số tiền cố định",
  [CouponType.FreeShipping]: "Miễn phí vận chuyển",
};

export interface CouponListDataType {
  id: string;
  code: string;
  description: string;
  discount_type: CouponType;
  value: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  count_used: number;
  is_active: boolean;
}

export interface CouponListParams {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  filters?: Record<string, string>;
}

export interface CouponDetailType {
  id: string;
  code: string;
  description: string;
  discount_type: CouponType;
  value: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  count_used: number;
  user_used: string;
  accept_for_items: string;
  minimum_order_amount: number;
  minimum_item_quantity: number;
  is_active: boolean;
  store_id: string;
  promotion_id: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export type CouponListResponse = PagedResult<CouponListDataType>; 