import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import {
  menuItemStatusOptions,
  type MenuItemListDataType,
  type MenuItemListParams,
} from "../../../type/menuItem/menuItem";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsMenuItem } from "../../common/Columns/Colums";

interface MenuItemListProps {
  fetchData: (params: MenuItemListParams) => void;
}

const selectConfigs: SelectConfig[] = [
  {
    name: "is_available",
    type: "select",
    label: "Status",
    placeholder: "Select Status",
    options: menuItemStatusOptions,
  },
  {
    name: "category",
    type: "select",
    label: "Category",
    placeholder: "Select Category",
    options: [
      { value: "", label: "All Categories" },
    ],
  },
];

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
      search_by: "title",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<MenuItemListDataType>(
    {
      currentParams: params,
      setParams,
    }
  );

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigs}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<MenuItemListDataType>
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
          rowKey="id"
        />
      </ContentInner>
    </div>
  );
};

export default MenuItemList; 