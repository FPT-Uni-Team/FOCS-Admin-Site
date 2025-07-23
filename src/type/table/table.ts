
export interface TableDTO {
  id: string;
  table_number: number;
  qr_code?: string;
  status: number;
  is_active: boolean;
  store_id: string;
  generate_qr?: boolean;
}

export interface TableListResponse {
  items: TableDTO[];
  total_count: number;
  page_index: number;
  page_size: number;
}

export interface TableListParams {
  storeId: string;
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  filters?: Record<string, string>;
}

export const TableStatus = {
  Available: 0,
  Occupied: 1,
  Reserved: 2,
  Cleaning: 3,
  OutOfService: 4,
} as const;

export const TableStatusLabel = {
  0: "Available",
  1: "Occupied", 
  2: "Reserved",
  3: "Cleaning",
  4: "OutOfService",
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

export const tableStatusOptions = [
  { value: "", label: "All Type" },
  ...Object.entries(TableStatus).map(([key, value]) => ({
    value: String(value),
    label: key,
  })),
];

export interface TableCreateRequest {
  table_number: number;
  status: number;
  is_active: boolean;
  store_id: string;
}

export type TableDataType = TableDTO; 