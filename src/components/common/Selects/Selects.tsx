import { statusOptionsCategory } from "../../../type/category/category";
import type { SelectConfig } from "../../../type/common/common";
import { statusOptions } from "../../../type/menu/menu";
import { tableStatusOptions } from "../../../type/table/table";
import { orderStatusOptions, orderTypeOptions, paymentStatusOptions } from "../../../type/order/order";

export const selectConfigsMenuStatus: SelectConfig[] = [
  {
    name: "is_available",
    type: "select",
    label: "Menu Item Status",
    placeholder: "Select Menu Item Status",
    options: statusOptions,
  },
];

export const selectConfigsCategoryStatus: SelectConfig[] = [
  {
    name: "is_active",
    type: "select",
    label: "Category Status",
    placeholder: "Select Category Status",
    options: statusOptionsCategory,
  },
];

export const selectConfigsTableStatus: SelectConfig[] = [
  {
    name: "status",
    type: "select", 
    label: "Table Status",
    placeholder: "Select Table Status",
    options: tableStatusOptions,
  },
];

export const selectConfigsOrderStatus: SelectConfig[] = [
  {
    name: "order_status",
    type: "select",
    label: "Order Status",
    placeholder: "Select Order Status",
    options: orderStatusOptions,
  },
];

export const selectConfigsOrderType: SelectConfig[] = [
  {
    name: "order_type",
    type: "select",
    label: "Order Type",
    placeholder: "Select Order Type",
    options: orderTypeOptions,
  },
];

export const selectConfigsPaymentStatus: SelectConfig[] = [
  {
    name: "payment_status",
    type: "select",
    label: "Payment Status",
    placeholder: "Select Payment Status",
    options: paymentStatusOptions,
  },
];

export const selectConfigsOrderFilters: SelectConfig[] = [
  {
    name: "order_status",
    type: "select",
    label: "Order Status",
    placeholder: "Select Order Status",
    options: orderStatusOptions,
  },
  {
    name: "order_type",
    type: "select",
    label: "Order Type",
    placeholder: "Select Order Type",
    options: orderTypeOptions,
  },
  {
    name: "payment_status",
    type: "select",
    label: "Payment Status",
    placeholder: "Select Payment Status",
    options: paymentStatusOptions,
  },
];
