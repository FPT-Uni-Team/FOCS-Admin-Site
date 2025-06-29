import { type FC, useCallback, useEffect, useState } from "react";
import {
  type CouponAdminDTO,
  type CouponListParams,
  couponStatusOptions,
  couponTypeOptions,
} from "../../../type/coupon/coupon";
import { useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import TableReuse from "../../common/Table/TableReuse";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsCouponList } from "../../common/Columns/Colums";

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

  const selectConfigs: SelectConfig[] = [
    {
      name: "discount_type",
      type: "select",
      label: "Coupon Type",
      placeholder: "Select Coupon Type",
      options: couponTypeOptions,
    },
    {
      name: "status",
      type: "select",
      label: "Coupon Status",
      placeholder: "Select Coupon Status",
      options: couponStatusOptions,
    },
    {
      name: "date",
      type: "rangePicker",
      label: "Coupon Date",
      placeholder: "Select Coupon Date",
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
          columns={columnsCouponList}
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
