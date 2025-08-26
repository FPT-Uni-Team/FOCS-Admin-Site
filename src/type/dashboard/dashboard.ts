export interface OrderStatisticResponse {
  pending_orders: number;
  inprogress_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  average_complete_time: number;
}

export interface OverviewStatisticResponse {
  total_revenue_today: number;
  total_orders: number;
  active_tables: number;
  available_tables: number;
  best_selling_item: {
    item_name: string;
    quantity: number;
  };
}

export interface KitchenStatisticResponse {
  total_order_wraps: number;
  current_processing_order_wrap: string;
  orders_not_in_progress: number;
  orders_in_progress: number;
  completed_orders: number;
  cancelled_orders: number;
  pending_orders: number;
  average_completion_time_minutes: number;
}

export interface FinanceStatisticResponse {
  daily_revenue: number;
  weekly_revenue: number;
  monthly_revenue: number;
  revenue_by_payment_method: {
    payment_method: string;
    total_revenue: number;
  }[];
  average_bill_value: number;
}

export interface DashboardParams {
  today?: boolean;
}
