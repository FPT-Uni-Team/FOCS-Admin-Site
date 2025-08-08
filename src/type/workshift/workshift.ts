export interface Shift {
  staffName: string;
  startTime: string;
  endTime: string;
}

export interface WorkshiftItem {
  id: string;
  workDate: string;
  shift: Shift[];
}

export interface WorkshiftListResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: WorkshiftItem[];
}

export interface WorkshiftListParams {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  filters?: Record<string, string>;
  storeId: string;
}

export interface WorkshiftDetailItem {
  scheduleId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface WorkshiftDetailResponse {
  items: WorkshiftDetailItem[];
}


export interface WorkshiftDetailResponseActual {
  id: string | null;
  workDate: string;
  shift: {
    staffId: string;
    staffName: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface WorkshiftDetailParams {
  id: string;
}

export interface WorkshiftCreatePayload {
  workDate: string;
  shift: {
    staffId: string;
    staffName: string;
    startTime: string;
    endTime: string;
  }[];
} 