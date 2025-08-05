import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import { defaultParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsVariantList } from "../../common/Columns/Colums";
import { selectConfigsVariantStatus } from "../../common/Selects/Selects";
import type { Variant } from "../../../type/variant/variant";

interface VariantListProps {
  fetchData: (params: ListPageParams) => void;
}

const VariantList: FC<VariantListProps> = ({ fetchData }) => {
  const { loading, variants, total } = useAppSelector(
    (state) => state.variantList
  );

  const [params, setParams] = useState<ListPageParams>(defaultParams());

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

  const handleOnChangeTable = createOnTableChangeHandler<Variant>({
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
        selectConfigs={selectConfigsVariantStatus}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<Variant>
          columns={columnsVariantList}
          dataSource={variants as Variant[]}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} variants`,
            showSizeChanger: true,
          }}
          rowKey="id"
        />
      </ContentInner>
    </div>
  );
};

export default VariantList;