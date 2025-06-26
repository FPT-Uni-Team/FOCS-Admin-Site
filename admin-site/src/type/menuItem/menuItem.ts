export interface MenuItemListDataType {
    id: string;
    name: string;
    description: string;
    images: string;
    base_price: number;
    is_available: boolean;
    store_id: string;
  }
  
  export interface MenuItemListParams {
    page: number;
    page_size: number;
    search_by?: string;
    search_value?: string;
    sort_by?: string;
    sort_order?: string;
    filters?: Record<string, string>;
  }
  
  export const menuItemStatusOptions = [
  { value: "", label: "All Status" },
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
];

export interface MenuItemCreatePayload {
  name: string;
  description?: string;
  images?: string;
  base_price: number;
  category_ids?: string[];
  is_available?: boolean;
  store_id: string;
}

export const categoryOptions = [
  { value: "cat1", label: "Beverages" },
  { value: "cat2", label: "Main Course" },
  { value: "cat3", label: "Desserts" },
  { value: "cat4", label: "Appetizers" },
];

