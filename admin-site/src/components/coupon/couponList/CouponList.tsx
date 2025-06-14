import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import type { SortOrder } from "antd/es/table/interface";
import TableReuse from "../../common/Table/TableReuse";
import {
  CouponTypeLabel,
  type CouponListDataType,
  type CouponListParams,
} from "../../../type/coupon/coupon";
import { useAppSelector } from "../../../hooks/redux";
import { formatDate } from "../../../helper/formatDate";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { SelectConfig } from "../../../type/common/common";

interface CouponListProps {
  fetchData: (params: CouponListParams) => void;
}

const CouponList: FC<CouponListProps> = ({ fetchData }) => {
  const navigate = useNavigate();
  const { loading, coupons, total, error } = useAppSelector(
    (state) => state.couponList
  );
  const [params, setParams] = useState<CouponListParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const handleRowClick = (record: CouponListDataType) => {
    navigate(`/coupons/${record.id}`);
  };

  const columns = [
    {
      title: "Mã Coupon",
      dataIndex: "code",
      key: "code",
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      sorter: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      sortDirections: [
        "ascend" as SortOrder,
        "descend" as SortOrder,
        "ascend" as SortOrder,
      ],
      sorter: true,
    },
    {
      title: "Loại Coupon",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (text: number) => {
        return CouponTypeLabel[text as keyof typeof CouponTypeLabel];
      },
    },
    {
      title: "Giá trị giảm",
      dataIndex: "value",
      key: "value",
      render: (value: number, record: CouponListDataType) => {
        if (record.discount_type === 0) { // Percentage
          return `${value}%`;
        }
        return `${value.toLocaleString()}đ`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        isActive ? 'Đang hoạt động' : 'Không hoạt động'
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
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
      title: "Ngày kết thúc",
      dataIndex: "end_date",
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
    {
      title: "Sử dụng",
      key: "usage",
      render: (record: CouponListDataType) => (
        <span>{record.count_used}/{record.max_usage}</span>
      ),
    },
  ];

  const selectConfigs: SelectConfig[] = [
    {
      name: "discount_type",
      type: "select",
      label: "Loại Coupon",
      placeholder: "Chọn loại coupon",
      options: [
        { value: "0", label: "Phần trăm" },
        { value: "1", label: "Số tiền cố định" },
        { value: "2", label: "Miễn phí vận chuyển" },
      ],
    },
    {
      name: "is_active",
      type: "select",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "true", label: "Đang hoạt động" },
        { value: "false", label: "Không hoạt động" },
      ],
    },
    {
      name: "date",
      type: "rangePicker",
      label: "Thời gian áp dụng",
      placeholder: "Chọn thời gian",
    },
  ];

  const formatFilters = (filters: Record<string, unknown>) => {
    const formatted = { ...filters };
    if (filters.date && Array.isArray(filters.date)) {
      formatted.start_date = filters.date[0].toISOString();
      formatted.end_date = filters.date[1].toISOString();
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
      search_by: "code",
      search_value: value,
    }));
  };

  const handleOnChangeTable = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter:
      | SorterResult<CouponListDataType>
      | SorterResult<CouponListDataType>[]
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
    console.log(params);
    fetchData(params);
  }, [fetchData, params]);

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '16px', padding: '8px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '4px' }}>
          <strong>Lỗi:</strong> {error}
        </div>
      )}
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigs}
        onSearch={onSearch}
      />
      <TableReuse
        columns={columns}
        dataSource={coupons}
        loading={loading}
        onChange={handleOnChangeTable}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total: total,
        }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default CouponList; 