import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsTableList } from "../../common/Columns/Colums";
import type { TableDataType, TableListParams } from "../../../type/table/table";
import type { ListPageParams } from "../../../type/common/common";
import { selectConfigsTableStatus } from "../../common/Selects/Selects";

interface TableListProps {
  fetchData: (params: TableListParams) => void;
  storeId: string;
}

const TableList: FC<TableListProps> = ({ fetchData, storeId }) => {
  const { loading, tables, total } = useAppSelector((state) => state.tableList);

  const [params, setParams] = useState<ListPageParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const onFilter = createOnFilterHandler({
    setParams,
  });

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "table_number", 
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<TableDataType>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    const tableParams: TableListParams = { ...params, storeId };
    fetchData(tableParams);
  }, [fetchData, params, storeId]);

  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigsTableStatus}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<TableDataType>
          columns={columnsTableList}
          dataSource={tables}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="id"
        />
      </ContentInner>
    </div>
  );
};

export default TableList; 