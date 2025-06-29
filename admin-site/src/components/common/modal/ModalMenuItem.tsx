import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";
import TableReuse from "../Table/TableReuse";
import FilterReuse from "../Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import type { MenuListDataType } from "../../../type/menu/menu";
import { fetchMenuItemsStart } from "../../../store/slices/menuItem/menuItemSlice";
import { columnsMenuItem } from "../Columns/Colums";
import { createOnTableChangeHandler } from "../Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { selectConfigsMenuStatus } from "../Selects/Selects";

interface MenuItemSelectionModalProps extends ModalProps {
  handleSubmitModal: (data: MenuListDataType[], key: React.Key[]) => void;
  selectedData: MenuListDataType[];
  selectedDataKey: React.Key[];
  singleSelectMode?: boolean;
}

const ModalMenuItem: React.FC<MenuItemSelectionModalProps> = ({
  handleSubmitModal,
  selectedData,
  selectedDataKey,
  singleSelectMode = false,
  ...modalProps
}) => {
  const dispatch = useAppDispatch();
  const { loading, menuItems, total } = useAppSelector(
    (state) => state.menuItem
  );
  const [selectedMenuItems, setSelectedMenuItems] =
    useState<MenuListDataType[]>(selectedData);
  const [selectedMenuItemKeys, setSelectedMenuItemKeys] =
    useState<React.Key[]>(selectedDataKey);

  const [params, setParams] = useState<ListPageParams>({
    page: 1,
    page_size: 5,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const onRowSelectionChange = useCallback(
    (selectedRowKeys: React.Key[], selectedRows: MenuListDataType[]) => {
      setSelectedMenuItems(selectedRows);
      setSelectedMenuItemKeys(selectedRowKeys);
    },
    []
  );

  const rowSelection = {
    selectedRowKeys: selectedMenuItemKeys,
    onChange: onRowSelectionChange,
    getCheckboxProps: (record: MenuListDataType) => ({
      disabled:
        singleSelectMode &&
        selectedMenuItemKeys.length > 0 &&
        !selectedMenuItemKeys.includes(record.menuId),
    }),
  };

  const handleOnChangeTable = createOnTableChangeHandler<MenuListDataType>({
    currentParams: params,
    setParams,
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

  useEffect(() => {
    dispatch(fetchMenuItemsStart(params));
  }, [dispatch, params]);

  return (
    <Modal
      {...modalProps}
      onOk={() => handleSubmitModal(selectedMenuItems, selectedMenuItemKeys)}
      centered
    >
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigsMenuStatus}
        onSearch={onSearch}
        isShowFilter={true}
      />
      <TableReuse
        columns={columnsMenuItem}
        dataSource={menuItems}
        loading={loading}
        onChange={handleOnChangeTable}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total: total,
          showTotal: (total) => `Total ${total} items`,
        }}
        rowSelection={rowSelection}
        rowKey="menuId"
      />
    </Modal>
  );
};

export default ModalMenuItem;
