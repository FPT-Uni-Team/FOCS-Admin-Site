import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Card, 
  Descriptions, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Divider, 
  Alert, 
  Row, 
  Col,
  Statistic,
  Progress,
  Spin
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  CarOutlined
} from "@ant-design/icons";
import type { RootState } from "../../../store/store";
import { fetchCouponDetailStart } from "../../../store/slices/coupon/couponDetailSlice";
import { CouponTypeLabel } from "../../../type/coupon/coupon";
import { formatDate } from "../../../helper/formatDate";
import CouponTrackUsage from "../couponTrackUsage/CouponTrackUsage";

const { Title, Text } = Typography;

const CouponDetail: React.FC = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { coupon, loading, error } = useSelector(
    (state: RootState) => state.couponDetail
  );

  useEffect(() => {
    if (couponId) {
      dispatch(fetchCouponDetailStart({ storeId: "default-store", couponId }));
    }
  }, [dispatch, couponId]);

  const handleBack = useCallback(() => {
    navigate("/coupons");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (couponId) {
      navigate(`/coupons/${couponId}/edit`);
    }
  }, [couponId, navigate]);

  const getCouponTypeIcon = useCallback((discountType: number) => {
    switch (discountType) {
      case 0: return <PercentageOutlined />;
      case 1: return <DollarOutlined />;
      case 2: return <CarOutlined />;
      default: return null;
    }
  }, []);

  const getCouponTypeText = useCallback((discountType: number) => {
    return CouponTypeLabel[discountType as keyof typeof CouponTypeLabel] || "Unknown";
  }, []);

  const getDiscountValue = useCallback((discountType: number, value: number) => {
    if (discountType === 0) { 
      return `${value}%`;
    } else if (discountType === 1) { 
      return `${value.toLocaleString('vi-VN')}đ`;
    } else if (discountType === 2) { 
      return "Free Shipping";
    }
    return `${value}`;
  }, []);

  const getStatusColor = useCallback((isActive: boolean, startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isActive) return "red";
    if (now < start) return "orange";
    if (now > end) return "red";
    return "green";
  }, []);

  const getStatusText = useCallback((isActive: boolean, startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isActive) return "Không hoạt động";
    if (now < start) return "Chưa bắt đầu";
    if (now > end) return "Đã hết hạn";
    return "Đang hoạt động";
  }, []);

  const getUsagePercentage = useCallback((used: number, total?: number) => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Đang tải thông tin coupon...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Error loading data"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button onClick={handleBack}>Quay lại</Button>
              <Button type="primary" onClick={() => {
                if (couponId) {
                  dispatch(fetchCouponDetailStart({ storeId: "default-store", couponId }));
                }
              }}>
                Thử lại
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  // Not found state
  if (!coupon) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Không tìm thấy coupon"
          description="Coupon không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={handleBack}>
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  // Check if coupon is expired or has issues
  const now = new Date();
  const endDate = new Date(coupon.end_date);
  const isExpired = now > endDate;
  const isUsageLimitReached = coupon.max_usage && coupon.count_used >= coupon.max_usage;
  const usagePercentage = getUsagePercentage(coupon.count_used, coupon.max_usage);
  const couponType = coupon.code ? "manual" : "auto";

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết Coupon
          </Title>
        </Space>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                            Edit
        </Button>
      </div>

      {/* Error Alerts */}
      {isExpired && (
        <Alert
                      message="Coupon is not available"
          description="Coupon has expired."
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {isUsageLimitReached && (
        <Alert
                      message="Usage limit reached"
            description="This coupon has reached its maximum usage limit."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Main Information */}
        <Col xs={24} lg={16}>
          <Card style={{ background: 'white', borderRadius: '8px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Title level={3} style={{ margin: '0 0 8px 0' }}>
                {coupon.description}
              </Title>
              <Space wrap>
                <Text code style={{ 
                  fontFamily: 'monospace', 
                  background: '#f0f0f0', 
                  padding: '2px 6px', 
                  borderRadius: '4px' 
                }}>
                  Code: {coupon.code}
                </Text>
                <Tag color={getStatusColor(coupon.is_active, coupon.start_date, coupon.end_date)}>
                  {getStatusText(coupon.is_active, coupon.start_date, coupon.end_date)}
                </Tag>
                <Tag color={couponType === "manual" ? "blue" : "green"}>
                  {couponType === "manual" ? "Manual" : "Auto"}
                </Tag>
              </Space>
            </div>

            <Divider />

            <Descriptions column={2}>
              <Descriptions.Item label="ID" span={2}>
                <Text code>{coupon.id}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Discount Type">
                <Tag 
                  icon={getCouponTypeIcon(coupon.discount_type)} 
                  color="blue"
                >
                  {getCouponTypeText(coupon.discount_type)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Discount Value">
                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {getDiscountValue(coupon.discount_type, coupon.value)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày bắt đầu">
                <Space>
                  <CalendarOutlined style={{ color: '#52c41a' }} />
                  {formatDate(coupon.start_date)}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày kết thúc">
                <Space>
                  <CalendarOutlined style={{ color: '#ff4d4f' }} />
                  {formatDate(coupon.end_date)}
                </Space>
              </Descriptions.Item>

              {coupon.minimum_order_amount && (
                <Descriptions.Item label="Minimum Order">
                  <Space>
                    <DollarOutlined />
                    {coupon.minimum_order_amount.toLocaleString('vi-VN')}đ
                  </Space>
                </Descriptions.Item>
              )}

              {coupon.minimum_item_quantity && (
                <Descriptions.Item label="Minimum Items Quantity">
                  <Space>
                    <ShoppingOutlined />
                    {coupon.minimum_item_quantity} items
                  </Space>
                </Descriptions.Item>
              )}

              {coupon.accept_for_items && (
                <Descriptions.Item label="Áp dụng cho" span={2}>
                  <Text>{coupon.accept_for_items}</Text>
                </Descriptions.Item>
              )}

              {coupon.user_used && (
                <Descriptions.Item label="Applicable Items" span={2}>
                  <Space>
                    <UserOutlined />
                    <Text>{coupon.user_used}</Text>
                  </Space>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Store ID" span={2}>
                <Text code>{coupon.store_id}</Text>
              </Descriptions.Item>

              {coupon.promotion_id && (
                <Descriptions.Item label="Promotion ID" span={2}>
                  <Text code>{coupon.promotion_id}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Statistics and Status */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Usage Statistics */}
            <Card title="Usage Statistics" style={{ background: 'white' }}>
              <Statistic
                                  title="Used"
                value={coupon.count_used}
                suffix={coupon.max_usage ? `/ ${coupon.max_usage}` : ''}
                prefix={<UserOutlined />}
              />
              {coupon.max_usage && (
                <Progress
                  percent={usagePercentage}
                  status={usagePercentage >= 100 ? 'exception' : 'active'}
                  style={{ marginTop: 16 }}
                />
              )}
              
              <Divider />
              
              <CouponTrackUsage
                couponId={coupon.id}
                couponCode={coupon.code}
                currentUsageCount={coupon.count_used}
                maxUsage={coupon.max_usage}
                isActive={coupon.is_active}
                onUsagePreviewd={() => {
                  // Optional: refresh coupon detail if needed
                  console.log('Usage preview completed');
                }}
              />
            </Card>

            {/* Validation Status */}
            <Card title="Validation Status" style={{ background: 'white' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <Text>Valid coupon code</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                                      <Text>Valid time period</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                  {isExpired || isUsageLimitReached ? (
                    <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                  ) : (
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  )}
                  <Text>
                    {isExpired || isUsageLimitReached ? 'Cannot be used' : 'Available for use'}
                  </Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default CouponDetail; 