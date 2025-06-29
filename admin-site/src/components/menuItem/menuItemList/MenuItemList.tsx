import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsMenuItem } from "../../common/Columns/Colums";
import type { MenuListDataType } from "../../../type/menu/menu";
import { selectConfigsMenuStatus } from "../../common/Selects/Selects";
interface MenuItemListProps {
  fetchData: (params: ListPageParams) => void;
}

const MenuItemList: FC<MenuItemListProps> = ({ fetchData }) => {
  const { loading, menuItems, total } = useAppSelector(
    (state) => state.menuItem
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
      search_by: "name",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<MenuListDataType>({
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
        selectConfigs={selectConfigsMenuStatus}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<MenuListDataType>
          columns={columnsMenuItem}
          dataSource={menuItems}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="menuId"
        />
      </ContentInner>
    </div>
  );
};

export default MenuItemList;
