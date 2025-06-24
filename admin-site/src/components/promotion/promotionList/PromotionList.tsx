import { type FC, useEffect, useState } from "react";
import type { SortOrder } from "antd/es/table/interface";
import TableReuse from "../../common/Table/TableReuse";
import {
  PromotionStatusLabel,
  promotionStatusOptions,
  PromotionTypeLabel,
  promotionTypeOptions,
  type PromotionListDataType,
  type PromotionListParams,
} from "../../../type/promotion/promotion";
import { useAppSelector } from "../../../hooks/redux";
import { formatDate } from "../../../helper/formatDate";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import CustomLink from "../../common/Link/CustomLink";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
interface PromotionListProps {
  fetchData: (params: PromotionListParams) => void;
}

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

  const columns = [
    {
      title: "Promotion Name",
      dataIndex: "promotionName",
      key: "title",
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      render: (text: string) => {
        return (
          <CustomLink title={text} href={`/promotions/${text}`} key={text} />
        );
      },
      sorter: true,
    },
    {
      title: "Promotion Type",
      dataIndex: "promotionType",
      key: "promotion_type",
      render: (text: number) => {
        return PromotionTypeLabel[text as keyof typeof PromotionTypeLabel];
      },
    },
    {
      title: "Status",
      dataIndex: "promotionStatus",
      key: "status",
      render: (text: number) => {
        return PromotionStatusLabel[text as keyof typeof PromotionStatusLabel];
      },
    },
    {
      title: "Start Date",
      dataIndex: "promotionStartDate",
      key: "start_date",
      sorter: true,
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      render: (text: string) => {
        return formatDate(text);
      },
    },
    {
      title: "End Date",
      dataIndex: "promotionEndDate",
      key: "end_date",
      sorter: true,
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      render: (text: string) => {
        return formatDate(text);
      },
    },
  ];

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
          columns={columns}
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
