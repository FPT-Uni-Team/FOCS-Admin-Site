import type { MenuListDataType } from "../menu/menu";
import type { PromotionListDataType } from "../promotion/promotion";

export const CouponType = {
  Percentage: 0,
  FixedAmount: 1,
  FreeShipping: 2,
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];

export const CouponTypeLabel: Record<CouponType, string> = {
  [CouponType.Percentage]: "Percentage Discount",
  [CouponType.FixedAmount]: "Fixed Amount Discount",
  [CouponType.FreeShipping]: "Free Shipping",
};

export const couponTypeOptions = [
  { value: "", label: "All Type" },
  ...Object.keys(CouponTypeLabel).map((key) => ({
    value: key,
    label: CouponTypeLabel[key as unknown as keyof typeof CouponTypeLabel],
  })),
];

export const CouponStatus = {
  UnAvailable: 0,
  NotStarted: 1,
  OnGoing: 2,
  Expired: 3,
} as const;

export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus];

export const CouponStatusLabel: Record<CouponStatus, string> = {
  [CouponStatus.UnAvailable]: "UnAvailable",
  [CouponStatus.NotStarted]: "Not Start",
  [CouponStatus.OnGoing]: "On Going",
  [CouponStatus.Expired]: "Expired",
};

export const couponStatusOptions = [
  { value: "", label: "All Type" },
  ...Object.keys(CouponStatusLabel).map((key) => ({
    value: key,
    label: CouponStatusLabel[key as unknown as keyof typeof CouponStatusLabel],
  })),
];

export const CouponCreationType = {
  AutoGenerate: 0,
  Manual: 1,
} as const;

export type CouponCreationType =
  (typeof CouponCreationType)[keyof typeof CouponCreationType];

export const CouponCreationTypeLabel: Record<CouponCreationType, string> = {
  [CouponCreationType.AutoGenerate]: "Auto Generate Code",
  [CouponCreationType.Manual]: "Manual Input Code",
};

export const couponCreationOptions = Object.values(CouponCreationType).map(
  (value) => ({
    value,
    label: CouponCreationTypeLabel[value],
  })
);

export const DiscountType = {
  Percent: 0,
  FixedAmount: 1,
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const DiscountTypeLabel: Record<DiscountType, string> = {
  [DiscountType.Percent]: "Percentage Discount",
  [DiscountType.FixedAmount]: "Fixed Amount Discount",
};

export const discountTypeOptions = Object.values(DiscountType).map((value) => ({
  value,
  label: DiscountTypeLabel[value],
}));

export const CouponConditionType = {
  MinOrderAmount: 0,
  MinItemsQuantity: 1,
} as const;

export type CouponConditionType =
  (typeof CouponConditionType)[keyof typeof CouponConditionType];

export const CouponConditionTypeLabel: Record<CouponConditionType, string> = {
  [CouponConditionType.MinOrderAmount]: "Minimum order value",
  [CouponConditionType.MinItemsQuantity]: "Minimum items in cart",
};

export interface CouponConditionRequest {
  condition_type: CouponConditionType;
  value: number;
}

export const couponConditionOptions = Object.values(CouponConditionType).map(
  (value) => ({
    value,
    label: CouponConditionTypeLabel[value],
  })
);

// Main coupon creation request interface
export interface CouponCreateRequest {
  id?: string; // Optional - Guid?
  code?: string; // Required if coupon_type is Manual, omit for AutoGenerate
  coupon_type: CouponCreationType; // Required - enum
  description: string; // Required
  discount_type: DiscountType; // Required - enum
  value: number; // Required - discount value
  start_date: string; // Required - DateTime
  end_date: string; // Required - DateTime
  status?: CouponStatus; // Optional - computed based on business logic
  max_usage: number; // Required
  count_used: number; // Required - initialized as 0
  max_usage_per_user?: number; // Optional
  accept_for_items?: string; // Optional
  coupon_condition: CouponConditionRequest; // Required
  is_active: boolean; // Required
  promotion_id?: string; // Optional - Guid?
  store_id?: string; // Optional - will be added by service
  user_id?: string; // Optional - will be added by service
}

export interface CouponUpdateRequest {
  id?: string;
  code: string; // Required and not empty if CouponType is Manual
  coupon_type: CouponCreationType; // Required - enum value
  description: string; // Required - Description of coupon
  discount_type: DiscountType; // Required - enum value
  value: number; // Required - Discount value
  start_date: string; // Required - DateTime - Start time when the coupon becomes active
  end_date: string; // Required - DateTime - Expiry time of the coupon
  status?: CouponStatus; // Optional - Don't have to input
  max_usage: number; // Required - Maximum times the coupon can be used
  count_used: number; // Required - Number of time coupon been used
  max_usage_per_user?: number; // Optional - Max usage per user
  accept_for_items?: string; // Optional - Assign this coupon for specific item in menu
  coupon_condition: CouponConditionRequest; // Required - See below
  is_active: boolean; // Required - Coupon available
  promotion_id?: string; // Optional - Guid? - ID of the promotion this coupon is linked to
}

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
  status: CouponStatus;
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
  [x: string]: any;
  id: string;
  code: string;
  coupon_type: number;
  description: string;
  discount_type: CouponType;
  value: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  count_used: number;
  accept_for_items: [];
  accept_for_items_list: MenuListDataType[];
  minimum_order_amount: number;
  minimum_item_quantity: number;
  is_active: boolean;
  promotion_id: string;
  status: number;
  promotion?: PromotionListDataType[];
  coupon_condition?: {
    condition_type: number;
    value: number;
  };
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CouponAdminDTO {
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
  status: CouponStatus;
}

export type CouponListResponse = PagedResult<CouponAdminDTO>;

export interface SetCouponStatusRequest {
  id: string;
  isActive: boolean;
}

export interface TrackCouponUsageResponse {
  totalLeft: number;
  leftPerUser?: number;
  couponId: string;
  currentUsage: number;
  maxUsage: number;
  maxUsagePerUser?: number;
  userUsage?: number;
}

export interface SetCouponStatusResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    isActive: boolean;
  };
}

// Coupon Assignment Types
export interface CouponAssignRequest {
  couponIds: string[];
  promotionId: string;
}

export interface CouponAssignResponse {
  success: boolean;
  message: string;
  data?: {
    promotionId: string;
    assignedCouponIds: string[];
    totalAssigned: number;
  };
}
