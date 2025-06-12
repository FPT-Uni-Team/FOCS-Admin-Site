import { type FC, useEffect, useState } from "react";
import type {
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import type { SortOrder } from "antd/es/table/interface";
import TableReuse from "../../common/Table/TableReuse";
import {
  PromotionTypeLabel,
  type PromotionListDataType,
  type PromotionListParams,
} from "../../../type/promotion/promotion";
import { useAppSelector } from "../../../hooks/redux";
import { formatDate } from "../../../helper/formatDate";
interface PromotionListProps {
  fetchData: (params: PromotionListParams) => void;
}

const PromotionList: FC<PromotionListProps> = ({ fetchData }) => {
  const { loading, promotions, total } = useAppSelector(
    (state) => state.promotion
  );
  const [params, setParams] = useState<PromotionListParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const handleOnChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter:
      | SorterResult<PromotionListDataType>
      | SorterResult<PromotionListDataType>[]
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
      key: "is_active",
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

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <TableReuse
      columns={columns}
      dataSource={promotions}
      loading={loading}
      onChange={handleOnChangeTable}
      pagination={{
        current: params.page,
        pageSize: params.page_size,
        total: total,
      }}
      rowKey="key"
    />
  );
};

export default PromotionList;
