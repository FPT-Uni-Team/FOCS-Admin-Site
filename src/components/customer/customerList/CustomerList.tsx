import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import {
  columnsCustomer,
  type CustomerDataType,
} from "../../common/Columns/Colums";

interface CustomerListProps {
  fetchData: (params: ListPageParams) => void;
}

const CustomerList: FC<CustomerListProps> = ({ fetchData }) => {
  const { loading, customers, total } = useAppSelector(
    (state) => state.customerList
  );

  const [params, setParams] = useState<ListPageParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const onFilter = createOnFilterHandler({ setParams });

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "email",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<CustomerDataType>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      <FilterReuse onFilter={onFilter} onSearch={onSearch} />
      <ContentInner>
        <TableReuse<CustomerDataType>
          columns={columnsCustomer}
          dataSource={customers}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="email"
        />
      </ContentInner>
    </div>
  );
};

export default CustomerList;
