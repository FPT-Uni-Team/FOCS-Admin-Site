import { type FC, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsFeedback } from "../../common/Columns/Colums";
import { selectConfigsFeedbackStatus } from "../../common/Selects/Selects";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";
import { useNavigate } from "react-router-dom";

interface FeedbackListProps {
  fetchData: (params: ListPageParams) => void;
}

const FeedbackList: FC<FeedbackListProps> = ({ fetchData }) => {
  const navigate = useNavigate();
  const { loading, feedbacks, total } = useAppSelector(
    (state) => state.feedbackList
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
      search_by: "customer_name",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<FeedbackListDataType>({
    currentParams: params,
    setParams,
  });

  const handleRowClick = (record: FeedbackListDataType) => {
    navigate(`/feedbacks/${record.id}`);
  };

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigsFeedbackStatus}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<FeedbackListDataType>
          columns={columnsFeedback}
          dataSource={feedbacks}
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
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
        />
      </ContentInner>
    </div>
  );
};

export default FeedbackList;