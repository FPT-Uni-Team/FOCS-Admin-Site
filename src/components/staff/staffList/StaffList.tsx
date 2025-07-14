import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { type PromotionListParams } from "../../../type/promotion/promotion";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsStaffList } from "../../common/Columns/Colums";
import type { StaffDataType } from "../../../type/staff/staff";
interface StaffListProps {
  fetchData: (params: PromotionListParams) => void;
}

const StaffList: FC<StaffListProps> = ({ fetchData }) => {
  const { loading, staff, total } = useAppSelector((state) => state.staffList);

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
      search_by: "first_name",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<StaffDataType>({
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
        onSearch={onSearch}
        isShowFilter={true}
      />
      <ContentInner>
        <TableReuse<StaffDataType>
          columns={columnsStaffList}
          dataSource={staff}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="promotionId"
        />
      </ContentInner>
    </div>
  );
};

export default StaffList;
