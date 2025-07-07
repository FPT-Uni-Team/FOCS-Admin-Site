import type { VariantGroup } from "../variant/variant";

export interface MenuListDataType {
  menuId: string;
  menuName: string;
  menuDescription: string;
  menuBasePrice: number;
  isAvailable: boolean;
}

export const StatusType = {
  Available: true,
  Unavailable: false,
} as const;

export type StatusType = (typeof StatusType)[keyof typeof StatusType];

export const statusOptions = [
  { value: "", label: "All Type" },
  ...Object.entries(StatusType).map(([key, value]) => {
    return {
      value: String(value),
      label: key,
    };
  }),
];

export interface MenuItem {
  id?: string;
  name?: string;
  description?: string;
  images?: string | [];
  base_price?: number;
  is_available?: boolean;
  store_id?: string;
  category_ids?: [];
  variant_groups?: VariantGroup[];
}

export interface MenuItemCreatePayload {
  data: MenuItem;
  images: {
    images: [];
    mainImages: [];
  };
}
