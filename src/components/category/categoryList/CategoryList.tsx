import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsCategory } from "../../common/Columns/Colums";
import { selectConfigsCategoryStatus } from "../../common/Selects/Selects";
import type { CategoryListDataType } from "../../../type/category/category";
interface CategoryListProps {
  fetchData: (params: ListPageParams) => void;
}

const CategoryList: FC<CategoryListProps> = ({ fetchData }) => {
  const { loading, categories, total } = useAppSelector(
    (state) => state.categoryList
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

  const handleOnChangeTable = createOnTableChangeHandler<CategoryListDataType>({
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
        selectConfigs={selectConfigsCategoryStatus}
        onSearch={onSearch}
      />
      <ContentInner>
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
            showSizeChanger: true,
          }}
          rowKey="menuId"
        />
      </ContentInner>
    </div>
  );
};

export default CategoryList;
