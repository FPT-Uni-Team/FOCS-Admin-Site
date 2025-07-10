import { type FC, useCallback, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsCategory } from "../../common/Columns/Colums";
import { Modal, type ModalProps } from "antd";
import type { CategoryListDataType } from "../../../type/category/category";
import { fetchCategoriesStart } from "../../../store/slices/category/categoryListSlice";
import { selectConfigsCategoryStatus } from "../Selects/Selects";
interface ModalCategoryProps extends ModalProps {
  handleSubmitModal: (data: CategoryListDataType[], key: React.Key[]) => void;
  selectedData: CategoryListDataType[];
  selectedDataKey: React.Key[];
  singleSelectMode?: boolean;
  mode?: "Create" | "Update";
}

const ModalCategoryList: FC<ModalCategoryProps> = ({
  handleSubmitModal,
  selectedData,
  selectedDataKey,
  singleSelectMode,
  mode = "Create",
  ...modalProps
}) => {
  const { loading, categories, total } = useAppSelector(
    (state) => state.categoryList
  );
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryListDataType[]>(selectedData);
  const [selectedCategoryKeys, setSelectedCategoryKeys] =
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
    (selectedRowKeys: React.Key[], selectedRows: CategoryListDataType[]) => {
      setSelectedCategory(selectedRows);
      setSelectedCategoryKeys(selectedRowKeys);
    },
    []
  );

  const rowSelection = {
    selectedRowKeys: selectedCategoryKeys,
    onChange: onRowSelectionChange,
    getCheckboxProps: (record: CategoryListDataType) => ({
      disabled:
        (mode === "Update" && selectedDataKey.includes(record.id)) ||
        (singleSelectMode &&
          selectedCategoryKeys.length > 0 &&
          !selectedCategoryKeys.includes(record.id)),
    }),
  };

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

  const handleOnChangeTable = createOnTableChangeHandler<CategoryListDataType>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    dispatch(fetchCategoriesStart(params));
  }, [dispatch, params]);

  return (
    <Modal
      {...modalProps}
      onOk={() => {
        const filteredItems =
          mode === "Update"
            ? selectedCategory.filter(
                (item) => !selectedDataKey.includes(item.id)
              )
            : selectedCategory;

        const filteredKeys =
          mode === "Update"
            ? selectedCategoryKeys.filter(
                (key) => !selectedDataKey.includes(key)
              )
            : selectedCategoryKeys;
        handleSubmitModal(filteredItems, filteredKeys);
      }}
      centered
    >
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigsCategoryStatus}
        onSearch={onSearch}
      />
      <TableReuse<CategoryListDataType>
        columns={columnsCategory}
        dataSource={categories}
        loading={loading}
        onChange={handleOnChangeTable}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total,
          showTotal: (total) => `Total ${total} items`,
        }}
        rowKey="id"
        rowSelection={rowSelection}
      />
    </Modal>
  );
};

export default ModalCategoryList;
