import { type FC, useCallback, useEffect, useState } from "react";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import {
  CouponTypeLabel,
  CouponStatusLabel,
  type CouponAdminDTO,
  type CouponListParams,
  couponStatusOptions,
  couponTypeOptions,
} from "../../../type/coupon/coupon";
import { useAppSelector } from "../../../hooks/redux";
import { formatDate } from "../../../helper/formatDate";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import TableReuse from "../../common/Table/TableReuse";
import CustomLink from "../../common/Link/CustomLink";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";

interface CouponListProps {
  fetchData: (params: CouponListParams) => void;
}

const CouponList: FC<CouponListProps> = ({ fetchData }) => {
  const { loading, coupons, total } = useAppSelector(
    (state) => state.couponList
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

  const columns: ColumnsType<CouponAdminDTO> = [
    {
      title: "Counpon Code",
      dataIndex: "code",
      key: "code",
      render: (_, record: CouponAdminDTO) => {
        return (
          <>
            <CustomLink
              title={record.code}
              href={`/coupons/${record.id}`}
              key={record.id}
            />
          </>
        );
      },
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      sorter: true,
    },
    {
      title: "Coupon Type",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (discountType: number) => {
        return CouponTypeLabel[discountType as keyof typeof CouponTypeLabel];
      },
    },
    {
      title: "Coupon Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        return CouponStatusLabel[status as keyof typeof CouponStatusLabel];
      },
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      render: (date: string) => {
        return formatDate(date);
      },
      sorter: true,
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      render: (date: string) => {
        return formatDate(date);
      },
      sorter: true,
    },
  ];

  const selectConfigs: SelectConfig[] = [
    {
      name: "discount_type",
      type: "select",
      label: "Coupon Type",
      placeholder: "Select coupon type",
      options: couponTypeOptions,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      placeholder: "Select status",
      options: couponStatusOptions,
    },
    {
      name: "date",
      type: "rangePicker",
      label: "Application Period",
      placeholder: "Select time period",
    },
  ];

  const onFilter = createOnFilterHandler({
    setParams,
  });

  const onSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: trimmedValue ? "code" : "",
      search_value: trimmedValue,
    }));
  }, []);

  const handleOnChangeTable = createOnTableChangeHandler<CouponAdminDTO>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      <FilterReuse
        selectConfigs={selectConfigs}
        onFilter={onFilter}
        onSearch={onSearch}
      />
      <ContentInner>
        <TableReuse<CouponAdminDTO>
          key={`coupon-table-${coupons?.length || 0}`}
          columns={columns}
          dataSource={coupons}
          loading={loading}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          rowKey={(record) =>
            record.id || record.code || Math.random().toString()
          }
          onChange={handleOnChangeTable}
        />
      </ContentInner>
    </div>
  );
};

export default CouponList;
