import { type FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tag,
  Typography,
  Button,
  Alert,
  Row,
  Col,
  Space,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import type {
  TablePaginationConfig,
  SorterResult,
  FilterValue,
  ColumnsType,
} from "antd/es/table/interface";
import {
  PercentageOutlined,
  DollarOutlined,
  CarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import {
  CouponTypeLabel,
  CouponStatusLabel,
  type CouponAdminDTO,
  type CouponListParams,
} from "../../../type/coupon/coupon";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { formatDate } from "../../../helper/formatDate";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { SelectConfig } from "../../../type/common/common";
import TableReuse from "../../common/Table/TableReuse";
import { deleteCouponStart, clearDeleteCouponState } from "../../../store/slices/coupon/couponDeleteSlice";
import CouponStatusToggle from "../couponStatusToggle/CouponStatusToggle";
import CouponAssignForm from "../couponAssign/CouponAssignForm";

const { Text } = Typography;

interface CouponListProps {
  fetchData: (params: CouponListParams) => void;
}

const CouponList: FC<CouponListProps> = ({ fetchData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, coupons, total, error } = useAppSelector(
    (state) => state.couponList
  );
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = useAppSelector(
    (state) => state.couponDelete
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

  // State for assign coupon modal
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);

  const handleRowClick = useCallback((record: CouponAdminDTO) => {
    navigate(`/coupons/${record.id}`);
  }, [navigate]);

  const handleCreateCoupon = useCallback(() => {
    navigate("/coupons/create");
  }, [navigate]);

  const handleAssignCoupons = useCallback(() => {
    setIsAssignModalVisible(true);
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setIsAssignModalVisible(false);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchData(params);
  }, [params, fetchData]);

  const getCouponTypeIcon = useCallback((discountType: number) => {
    switch (discountType) {
      case 0: return <PercentageOutlined />;
      case 1: return <DollarOutlined />;
      case 2: return <CarOutlined />;
      default: return null;
    }
  }, []);

  // Handle delete success/error notifications
  useEffect(() => {
    if (deleteError) {
      message.error(deleteError);
      dispatch(clearDeleteCouponState());
    }
  }, [deleteError, dispatch]);

  // Handle delete success notification
  useEffect(() => {
    if (deleteSuccess) {
      message.success('Coupon đã được xóa thành công!');
      // Refresh the coupon list
      fetchData(params);
      dispatch(clearDeleteCouponState());
    }
  }, [deleteSuccess, dispatch, fetchData, params]);

  const columns: ColumnsType<CouponAdminDTO> = [
    {
      title: "Promotion Name",
      dataIndex: "description", 
      key: "description",
      width: 250,
      render: (text: string, record: CouponAdminDTO) => {
        // Ensure we have valid data before rendering
        const displayDescription = text && text !== 'string' && text.trim() ? text : record.code || 'N/A';
        const displayCode = record.code && record.code !== 'string' && record.code.trim() ? record.code : 'N/A';
        
        return (
          <div>
            <Text strong>{displayDescription}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Code: {displayCode}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "discount_type",
      key: "discount_type",
      width: 160,
      render: (discountType: number) => {
        const typeLabel = CouponTypeLabel[discountType as keyof typeof CouponTypeLabel] || 'Unknown';
        return (
          <Tag icon={getCouponTypeIcon(discountType)} style={{ minWidth: '140px', textAlign: 'center' }}>
            {typeLabel}
          </Tag>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 120,
      render: (value: number, record: CouponAdminDTO) => {
        const numValue = typeof value === 'number' && !isNaN(value) ? value : 0;
        
        if (record.discount_type === 0) {
          return <Text strong style={{ fontSize: '14px' }}>{numValue}%</Text>;
        } else if (record.discount_type === 1) {
          return <Text strong style={{ fontSize: '14px' }}>{numValue?.toLocaleString('vi-VN')}đ</Text>;
        } else {
          return <Text strong style={{ fontSize: '14px', color: '#52c41a' }}>Free</Text>;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) => {
        const statusValue = typeof status === 'number' ? status : 2; // Default to OnGoing
        const statusLabel = CouponStatusLabel[statusValue as keyof typeof CouponStatusLabel] || 'Không xác định';
        return <Text>{statusLabel}</Text>;
      },
    },
    {
      title: "Active Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 150,
      render: (isActive: boolean, record: CouponAdminDTO) => (
        <CouponStatusToggle
          couponId={record.id}
          isActive={isActive}
          couponCode={record.code}
        />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: 120,
      render: (date: string) => {
        if (!date || date === 'string' || !date.trim()) {
          return <Text>N/A</Text>;
        }
        try {
          return <Text>{formatDate(date)}</Text>;
        } catch {
          return <Text>N/A</Text>;
        }
      },
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: 120,
      render: (date: string) => {
        if (!date || date === 'string' || !date.trim()) {
          return <Text>N/A</Text>;
        }
        try {
          return <Text>{formatDate(date)}</Text>;
        } catch {
          return <Text>N/A</Text>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: 'right',
      render: (_, record: CouponAdminDTO) => (
        <Space>
          <Popconfirm
            title="Xóa coupon"
            description={`Bạn có chắc chắn muốn xóa coupon "${record.code}"?`}
            onConfirm={(e) => {
              e?.stopPropagation();
              dispatch(deleteCouponStart({ couponId: record.id }));
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleteLoading}
              onClick={(e) => e.stopPropagation()}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
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
      name: "status",
      type: "select",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "0", label: "Không khả dụng" },
        { value: "1", label: "Sắp diễn ra" },
        { value: "2", label: "Đang diễn ra" },
        { value: "3", label: "Đã hết hạn" },
      ],
    },
    {
      name: "date",
      type: "rangePicker",
      label: "Thời gian áp dụng",
      placeholder: "Chọn thời gian",
    },
  ];

  const formatFilters = useCallback((filters: Record<string, unknown>) => {
    const formatted = { ...filters };
    
    // Handle date range
    if (filters.date && Array.isArray(filters.date) && filters.date.length === 2) {
      formatted.start_date = filters.date[0]?.format?.('YYYY-MM-DD') || filters.date[0];
      formatted.end_date = filters.date[1]?.format?.('YYYY-MM-DD') || filters.date[1];
      delete formatted.date;
    }
    
    // Remove empty values
    Object.keys(formatted).forEach((key) => {
      if (formatted[key] === undefined || formatted[key] === null || formatted[key] === '') {
        delete formatted[key];
      }
    });
    
    return formatted;
  }, []);

  const onFilter = useCallback((values: Record<string, unknown>) => {
    const formattedFilters = formatFilters(values);
    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: formattedFilters as Record<string, string>,
    }));
  }, [formatFilters]);

  const onSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: trimmedValue ? "code" : "",
      search_value: trimmedValue,
    }));
  }, []);

  const handleOnChangeTable = useCallback((
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CouponAdminDTO> | SorterResult<CouponAdminDTO>[]
  ) => {
    let sort_by = "";
    let sort_order = "";
    
    if (!Array.isArray(sorter) && sorter.column && sorter.order) {
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
  }, [params]);

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  // Simple refresh when navigating back from create page
  useEffect(() => {
    const state = location.state as { 
      refresh?: boolean; 
      justCreated?: boolean;
    } | null;
    
    if (state?.refresh) {
      if (state.justCreated) {
        message.success('Coupon được tạo thành công!');
      }
      fetchData(params);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchData, params]);

  // Use coupons data (fallback to empty array if no data)
  const dataToUse = coupons?.length > 0 ? coupons.filter(coupon => {
    // Filter out invalid data entries
    return coupon && 
           coupon.id && 
           coupon.id !== 'string' &&
           (coupon.description !== 'string' || coupon.code !== 'string') &&
           coupon.description?.trim() !== '' &&
           coupon.code?.trim() !== '';
  }) : [];

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
        action={
          <Button size="small" onClick={() => fetchData(params)}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* Header with Create Button */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Danh sách Coupon
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              icon={<LinkOutlined />} 
              onClick={handleAssignCoupons}
            >
              Gán Coupons
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateCoupon}
            >
              Tạo Coupon Mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* API Status Banner */}
      {error && (
        <div style={{ 
          marginBottom: 16, 
          padding: '8px 16px', 
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: 6,
          fontSize: 14
        }}>
          <span style={{ 
            color: '#ff4d4f',
            fontWeight: 500 
          }}>
            ❌ API Error - {error}
          </span>
        </div>
      )}

      {/* Data Status Info */}
      {coupons && coupons.length > 0 && dataToUse.length !== coupons.length && (
        <div style={{ 
          marginBottom: 16, 
          padding: '8px 16px', 
          backgroundColor: '#fff7e6',
          border: '1px solid #ffd591',
          borderRadius: 6,
          fontSize: 14
        }}>
          <span style={{ 
            color: '#fa8c16',
            fontWeight: 500 
          }}>
            ⚠️ Đã lọc bỏ {coupons.length - dataToUse.length} bản ghi có dữ liệu không hợp lệ
          </span>
        </div>
      )}

      <FilterReuse
        selectConfigs={selectConfigs}
        onFilter={onFilter}
        onSearch={onSearch}
      />
      <TableReuse<CouponAdminDTO>
        key={`coupon-table-${coupons?.length || 0}`}
        columns={columns}
        dataSource={dataToUse}
        loading={loading}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} items`,
        }}
        rowKey={(record) => record.id || record.code || Math.random().toString()}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        onChange={handleOnChangeTable}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: coupons?.length === 0 ? 
            (loading ? 'Đang tải...' : error ? 'Lỗi tải dữ liệu' : 'Không có dữ liệu') : 
            'Không có dữ liệu'
        }}
      />
      

      {/* Coupon Assign Modal */}
      <CouponAssignForm
        visible={isAssignModalVisible}
        onCancel={handleCloseAssignModal}
      />
    </div>
  );
};

export default CouponList;