import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { TableListParams, TableCreateRequest } from "../type/table/table";

const tableService = {
  getListTables: (params: TableListParams) =>
    axiosClient.post(`${endpoints.table.list()}?storeId=${params.storeId}`, {
      page: params.page,
      page_size: params.page_size,
      search_by: params.search_by,
      search_value: params.search_value,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      filters: params.filters,
    }),
  getTableDetail: (id: string) =>
    axiosClient.get(endpoints.table.detail(id)),
  createTable: (tableData: TableCreateRequest) =>
    axiosClient.post(endpoints.table.create(), tableData),
};

export default tableService; 