import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import {
  promotionStatusOptions,
  promotionTypeOptions,
  type PromotionListDataType,
  type PromotionListParams,
} from "../../../type/promotion/promotion";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsPromotionList } from "../../common/Columns/Colums";
interface PromotionListProps {
  fetchData: (params: PromotionListParams) => void;
}

const selectConfigs: SelectConfig[] = [
  {
    name: "promotion_type",
    type: "select",
    label: "Promotion Type",
    placeholder: "Select Promotion Type",
    options: promotionTypeOptions,
  },
  {
    name: "status",
    type: "select",
    label: "Promotion Status",
    placeholder: "Select Promotion Status",
    options: promotionStatusOptions,
  },
  {
    name: "date",
    type: "rangePicker",
    label: "Promotion Date",
    placeholder: "Select Promotion Date",
  },
];

const PromotionList: FC<PromotionListProps> = ({ fetchData }) => {
  const { loading, promotions, total } = useAppSelector(
    (state) => state.promotion
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

  const handleOnChangeTable = createOnTableChangeHandler<PromotionListDataType>(
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
        <TableReuse
          columns={columnsPromotionList}
          dataSource={promotions}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="key"
        />
      </ContentInner>
    </div>
  );
};

export default PromotionList;
