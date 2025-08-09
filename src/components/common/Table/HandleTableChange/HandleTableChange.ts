import { type TablePaginationConfig } from "antd/es/table";
import { type SorterResult, type FilterValue } from "antd/es/table/interface";
import type { ListPageParams } from "../../../../type/common/common";

type OnTableChangeParams = {
  currentParams: ListPageParams;
  setParams: (params: ListPageParams) => void;
};

export function createOnTableChangeHandler<T>(config: OnTableChangeParams) {
  return (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    let sort_by = "";
    let sort_order = "";

    if (!Array.isArray(sorter) && sorter.column && sorter.order) {
      sort_by = sorter.columnKey as string;
      sort_order = sorter.order === "ascend" ? "asc" : "desc";
    }

    const newParams = {
      ...config.currentParams,
      page: pagination.current || 1,
      page_size: pagination.pageSize || 10,
      sort_by,
      sort_order,
    };

    config.setParams(newParams);
  };
}
