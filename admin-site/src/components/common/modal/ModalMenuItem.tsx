import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";
import TableReuse from "../Table/TableReuse";
import type {
  FilterValue,
  SorterResult,
  SortOrder,
  TablePaginationConfig,
} from "antd/es/table/interface";
import CustomLink from "../Link/CustomLink";
import FilterReuse from "../Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import type { MenuItemListDataType } from "../../../type/menuItem/menuItem";
import { fetchMenuItemsStart } from "../../../store/slices/menuItem/menuItemSlice";

interface MenuItemSelectionModalProps extends ModalProps {
  handleSubmitModal: (data: MenuItemListDataType[], key: React.Key[]) => void;
  selectedData: MenuItemListDataType[];
  selectedDataKey: React.Key[];
  singleSelectMode?: boolean;
}

const columnsMenuItem = [
  {
    title: "Menu item name",
    dataIndex: "name",
    key: "name",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (value: string) => {
      return <CustomLink title={value} href="promotions" />;
    },
    sorter: true,
  },
  {
    title: "Menu Base Price",
    dataIndex: "base_price",
    key: "base_price",
    sorter: true,
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
  },
  {
    title: "Status",
    dataIndex: "is_available",
    key: "is_available",
    render: (isAvailable: boolean) => {
      return isAvailable ? "Available" : "Unavailable";
    },
  },
];

const selectConfigs: SelectConfig[] = [
  {
    name: "promotion_type",
    type: "select",
    label: "Promotion Type",
    placeholder: "Select Promotion Type",
    options: [
      { value: "jack", label: "Jack" },
      { value: "lucy", label: "Lucy" },
      { value: "Yiminghe", label: "yiminghe" },
      { value: "disabled", label: "Disabled", disabled: true },
    ],
  },
  {
    name: "promotion_status",
    type: "select",
    label: "Promotion Status",
    placeholder: "Select Promotion Status",
    options: [
      { value: "jack", label: "Jack" },
      { value: "lucy", label: "Lucy" },
      { value: "Yiminghe", label: "yiminghe" },
      { value: "disabled", label: "Disabled", disabled: true },
    ],
  },
  {
    name: "date",
    type: "rangePicker",
    label: "Promotion Date",
    placeholder: "Select Promotion Date",
  },
];

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
    useState<MenuItemListDataType[]>(selectedData);
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
    (selectedRowKeys: React.Key[], selectedRows: MenuItemListDataType[]) => {
      setSelectedMenuItems(selectedRows);
      setSelectedMenuItemKeys(selectedRowKeys);
    },
    []
  );

  const rowSelection = {
    selectedRowKeys: selectedMenuItemKeys,
    onChange: onRowSelectionChange,
    getCheckboxProps: (record: MenuItemListDataType) => ({
      disabled:
        singleSelectMode &&
        selectedMenuItemKeys.length > 0 &&
        !selectedMenuItemKeys.includes(record.id),
    }),
  };

  const handleOnChangeTable = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<MenuItemListDataType> | SorterResult<MenuItemListDataType>[]
  ) => {
    let sort_by = "";
    let sort_order = "";
    if (!Array.isArray(sorter) && sorter.column) {
      sort_by = sorter.columnKey as string;
      sort_order = sorter.order === "ascend" ? "asc" : "desc";
    }
    const newParams = {
      ...params,
      page: pagination.current || 1,
      page_size: pagination.pageSize || 10,
      sort_by,
      sort_order,
    };
    setParams(newParams);
  };

  const onFilter = () => {};
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
        selectConfigs={selectConfigs}
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
        rowKey="id"
      />
    </Modal>
  );
};

export default ModalMenuItem;
