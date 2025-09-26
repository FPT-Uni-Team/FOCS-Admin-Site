export interface OrderVariantFeedback {
  variant_id: string;
  variant_name: string;
}

export interface OrderDetailFeedback {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  variants: OrderVariantFeedback[];
  quantity: number;
  unit_price: number;
  total_price: number;
  note: string;
}

export interface OrderFeeback {
  id: string;
  order_code: string;
  user_id: string;
  order_status: number;
  order_type: number;
  payment_status: number;
  sub_total_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer_note: string;
  created_at: string;
  remaining_time: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  discount_note: string[];
  is_feedback: boolean;
  order_details: OrderDetailFeedback[];
}

export interface FeedbackListDataType {
  id: string;
  order_id: string;
  user_id: string;
  rating: number;
  comment: string;
  images: string[];
  is_public: boolean;
  reply: string | null;
  created_at: string;
  order?: OrderFeeback;
}

export const StatusType = {
  Resolved: true,
  Unresolved: false,
} as const;

export type StatusType = (typeof StatusType)[keyof typeof StatusType];

export const statusOptionsFeedback = [
  { value: "", label: "All Status" },
  ...Object.entries(StatusType).map(([key, value]) => {
    return {
      value: String(value),
      label: key,
    };
  }),
];

export interface FeedbackUpdateRequest {
  public?: boolean;
  reply?: string;
}
