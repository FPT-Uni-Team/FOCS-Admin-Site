import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsWorkshiftList } from "../../common/Columns/Colums";
import type { WorkshiftItem, WorkshiftListParams } from "../../../type/workshift/workshift";

interface WorkshiftListProps {
  fetchData: (params: WorkshiftListParams) => void;
  storeId: string;
}

const WorkshiftList: FC<WorkshiftListProps> = ({ fetchData, storeId }) => {
  const { loading, workshifts, total } = useAppSelector(
    (state) => state.workshiftList
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
      search_by: "workDate",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<WorkshiftItem>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    const workshiftParams: WorkshiftListParams = { ...params, storeId };
    fetchData(workshiftParams);
  }, [fetchData, params, storeId]);

  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        onSearch={onSearch}
        isShowFilter={false}
      />
      <ContentInner>
        <TableReuse<WorkshiftItem>
          columns={columnsWorkshiftList}
          dataSource={workshifts}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} workshifts`,
            showSizeChanger: true,
          }}
          rowKey="workDate"
        />
      </ContentInner>
    </div>
  );
};

export default WorkshiftList; 