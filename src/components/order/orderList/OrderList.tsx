import { useEffect, useState, type FC } from "react";
import { useAppSelector } from "../../../hooks/redux";
import type { ListPageParams } from "../../../type/common/common";
import FilterReuse from "../../common/Filter/FilterReuse";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import TableReuse from "../../common/Table/TableReuse";
import { columnsOrderList } from "../../common/Columns/Colums";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import type { OrderListDataType } from "../../../type/order/order";
import { selectConfigsOrderFilters } from "../../common/Selects/Selects";

interface OrderListProps {
  fetchData: (params: ListPageParams) => void;
}

const OrderList: FC<OrderListProps> = ({ fetchData }) => {
  const { loading, orders, total } = useAppSelector(
    (state) => state.orderList
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

  const onFilter = createOnFilterHandler({
    setParams,
  });

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "order_code",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<OrderListDataType>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigsOrderFilters}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<OrderListDataType>
          columns={columnsOrderList}
          dataSource={orders}
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

export default OrderList;