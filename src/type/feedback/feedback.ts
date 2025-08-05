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