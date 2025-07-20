import { statusOptionsCategory } from "../../../type/category/category";
import type { SelectConfig } from "../../../type/common/common";
import { statusOptions } from "../../../type/menu/menu";
import { tableStatusOptions } from "../../../type/table/table";

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
