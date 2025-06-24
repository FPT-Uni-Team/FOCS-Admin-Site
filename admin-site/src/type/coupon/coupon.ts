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

  export const CouponStatus = {
    UnAvailable: 0,
    Incoming: 1,
    OnGoing: 2,
    Expired: 3,
  } as const;

  export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus];

  export const CouponStatusLabel: Record<CouponStatus, string> = {
    [CouponStatus.UnAvailable]: "Unavailable",
    [CouponStatus.Incoming]: "Upcoming",
    [CouponStatus.OnGoing]: "Active",
    [CouponStatus.Expired]: "Expired",
  };
  
  // New types for coupon creation according to API documentation
  export const CouponCreationType = {
    AutoGenerate: 0,
    Manual: 1,
  } as const;

  export type CouponCreationType = (typeof CouponCreationType)[keyof typeof CouponCreationType];

  export const CouponCreationTypeLabel: Record<CouponCreationType, string> = {
    [CouponCreationType.AutoGenerate]: "Auto Generate Code",
    [CouponCreationType.Manual]: "Manual Input Code",
  };

  export const DiscountType = {
    Percent: 0,
    FixedAmount: 1,
  } as const;

  export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

  export const DiscountTypeLabel: Record<DiscountType, string> = {
    [DiscountType.Percent]: "Percentage Discount",
    [DiscountType.FixedAmount]: "Fixed Amount Discount",
  };

  export const CouponConditionType = {
    MinOrderAmount: 0,
    MinItemsQuantity: 1,
  } as const;

  export type CouponConditionType = (typeof CouponConditionType)[keyof typeof CouponConditionType];

  export const CouponConditionTypeLabel: Record<CouponConditionType, string> = {
    [CouponConditionType.MinOrderAmount]: "Minimum Order Amount",
    [CouponConditionType.MinItemsQuantity]: "Minimum Items Quantity",
  };

  // Coupon condition interface
  export interface CouponConditionRequest {
    condition_type: CouponConditionType;
    value: number;
  }

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

  // Coupon update request interface - based on API documentation
  export interface CouponUpdateRequest {
    id?: string; // Optional - Guid?
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

  // Set Coupon Status Types
  export interface SetCouponStatusRequest {
    id: string; // Coupon ID (Path Parameter)
    isActive: boolean; // Query Parameter - true to enable, false to disable
  }

  // Track Coupon Usage Response - READ ONLY operation
  export interface TrackCouponUsageResponse {
    totalLeft: number; // remaining uses = MaxUsage - usageCount
    leftPerUser?: number; // remaining uses for the user = MaxUsagePerUser - userUsage (if applicable)
    couponId: string;
    currentUsage: number;
    maxUsage: number;
    maxUsagePerUser?: number;
    userUsage?: number; // if userId was provided
  }

  // Set Coupon Status Response
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
    couponIds: string[]; // List of coupon IDs to assign to promotion
    promotionId: string; // ID of the promotion to assign coupons to
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