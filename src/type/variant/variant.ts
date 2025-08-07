export interface Variant {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  prep_per_time?: number;
  quantity_per_time?: number;
}

export interface VariantGroup {
  id: string;
  group_name: string;
  is_required: boolean;
  min_select?: number;
  max_select?: number;
  variants: Variant[];
}

export interface VariantGroupUpdateRequest {
  name: string;
}

export interface VariantGroupCreateRequest {
  name: string;
}

export interface VariantCreateRequest {
  name: string;
  price: number;
  is_available: boolean;
  prep_per_time?: number;
  quantity_per_time?: number;
}

export interface VariantUpdateRequest {
  name: string;
  price: number;
  is_available: boolean;
  prep_per_time?: number;
  quantity_per_time?: number;
}


export interface VariantAssignRequest {
  variantIds: string[];
  variantGroupId: string;
}

export interface VariantAssignResponse {
  success: boolean;
  message: string;
  data?: {
    variantGroupId: string;
    assignedVariantIds: string[];
    totalAssigned: number;
  };
}
