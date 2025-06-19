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
import FilterReuse from "../../common/Filter/FilterReuse";
import type { SelectConfig } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import CustomLink from "../../common/Link/CustomLink";
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

  const formatFilters = (filters: Record<string, unknown>) => {
    const formatted = { ...filters };
    if (filters.date && Array.isArray(filters.date)) {
      formatted.start_date = filters.date[0].toISOString();
      formatted.start_end = filters.date[1].toISOString();
      delete formatted.date;
    }
    Object.keys(formatted).forEach((key) => {
      if (formatted[key] === undefined || formatted[key] === null) {
        delete formatted[key];
      }
    });
    return formatted;
  };

  const onFilter = (values: Record<string, unknown>) => {
    const formattedFilters = formatFilters(values);
    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: formattedFilters as Record<string, string>,
    }));
  };

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "title",
      search_value: value,
    }));
  };

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
            total: total,
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
