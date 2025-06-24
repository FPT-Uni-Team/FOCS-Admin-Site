import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Typography,
  Alert,
  Space,
  Divider,
  Tag,
} from 'antd';
import { LinkOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { assignCouponsStart, resetAssignState } from '../../../store/slices/coupon/couponAssignSlice';
import { fetchCouponsStart } from '../../../store/slices/coupon/couponListSlice';
import type { CouponAssignRequest } from '../../../type/coupon/coupon';
import axiosClient from '../../../api/axiosClient';
import endpoints from '../../../api/endpoint';

const { Title, Text } = Typography;
const { Option } = Select;

interface CouponAssignFormProps {
  visible: boolean;
  onCancel: () => void;
  promotionId?: string;
  promotionName?: string;
}

interface CouponOption {
  id: string;
  code: string;
  description: string;
  discount_type: number;
  value: number;
  is_active: boolean;
}

interface PromotionOption {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PromotionAPIItem {
  id: string;
  title?: string;
  name?: string;
  promotion_name?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const CouponAssignForm: React.FC<CouponAssignFormProps> = ({
  visible,
  onCancel,
  promotionId,
  promotionName,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string>(promotionId || '');
  
  // State để lưu promotion list từ API
  const [promotionList, setPromotionList] = useState<PromotionOption[]>([]);
  const [promotionLoading, setPromotionLoading] = useState(false);

  // Redux state
  const { loading: assignLoading, error: assignError, success: assignSuccess } = useAppSelector(
    (state) => state.couponAssign
  );
  const { coupons, loading: couponsLoading } = useAppSelector(
    (state) => state.couponList
  );

  // Load coupons và promotions khi modal mở
  useEffect(() => {
    if (visible) {
      // Load coupons
      dispatch(fetchCouponsStart({
        page: 1,
        page_size: 100, // Load more coupons for selection
      }));

      // Load promotions từ API
      const loadPromotions = async () => {
        try {
          setPromotionLoading(true);
          const storeId = localStorage.getItem('storeId') || '550e8400-e29b-41d4-a716-446655440000';
          const accessToken = localStorage.getItem('accessToken');
          
          console.log('🔄 Loading promotions for storeId:', storeId);
          
          // Gọi API promotion với authentication headers giống coupon API
          const response = await axiosClient.post(endpoints.promotion.get(storeId), {
            page: 1,
            page_size: 50,
            search_by: "",
            search_value: "",
            sort_by: "",
            sort_order: "",
            filters: {}
          }, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'StoreId': storeId,
              'Content-Type': 'application/json',
            },
            timeout: 15000
          });

          console.log('✅ Promotion List API Response:', response.data);
          
          // Xử lý response - giả sử API trả về { items: [...] } hoặc trực tiếp array
          let promotions: PromotionOption[] = [];
          
          if (response.data && Array.isArray(response.data.items)) {
            promotions = response.data.items
              .filter((promo: PromotionAPIItem) => promo.is_active) // Chỉ lấy promotion đang active
              .map((promo: PromotionAPIItem) => ({
                id: promo.id,
                title: promo.title || promo.name || promo.promotion_name || `Promotion ${promo.id}`,
                start_date: promo.start_date,
                end_date: promo.end_date,
                is_active: promo.is_active
              }));
          } else if (response.data && Array.isArray(response.data)) {
            promotions = response.data
              .filter((promo: PromotionAPIItem) => promo.is_active)
              .map((promo: PromotionAPIItem) => ({
                id: promo.id,
                title: promo.title || promo.name || promo.promotion_name || `Promotion ${promo.id}`,
                start_date: promo.start_date,
                end_date: promo.end_date,
                is_active: promo.is_active
              }));
          }

          setPromotionList(promotions);
          console.log('📋 Mapped promotions:', promotions);
          
        } catch (error) {
          console.error('❌ Failed to load promotions:', error);
          
          // Fallback: Sử dụng mock data khi API fail
          console.log('🔄 Using fallback mock promotions...');
          const mockPromotions: PromotionOption[] = [
            {
              id: '832E3A54-C524-4525-9D00-14EF69763B4D',
              title: 'Summer Sale 2023',
              start_date: '2025-06-10 16:43:06.9300000',
              end_date: '2025-06-30 16:43:06.9300000',
              is_active: true
            },
            {
              id: 'F37E8ED1-51D2-4DC5-AD7A-5052BEE7CDB9',
              title: 'Welcome New Customer',
              start_date: '2023-01-01',
              end_date: '2023-12-31',
              is_active: true
            },
            {
              id: '069CB2E4-3819-469A-875E-5581D28F0089',
              title: 'Free Shipping Campaign',
              start_date: '2023-03-01',
              end_date: '2023-12-31',
              is_active: true
            }
          ];
          
          setPromotionList(mockPromotions);
          console.log('📋 Using mock promotions:', mockPromotions);
          
          message.warning('Unable to load promotion list from API, using sample data');
        } finally {
          setPromotionLoading(false);
        }
      };

      loadPromotions();
    }
  }, [visible, dispatch]);

  // Handle success
  useEffect(() => {
    if (assignSuccess) {
              message.success('Coupons have been assigned to promotion successfully!');
      handleCancel();
    }
  }, [assignSuccess]);

  // Handle error
  useEffect(() => {
    if (assignError) {
      message.error(assignError);
    }
  }, [assignError]);

  // Set default promotion ID
  useEffect(() => {
    if (promotionId) {
      setSelectedPromotion(promotionId);
      form.setFieldsValue({ promotionId });
    }
  }, [promotionId, form]);

  const handleCancel = () => {
    form.resetFields();
    setSelectedCoupons([]);
    setSelectedPromotion(promotionId || '');
    setPromotionList([]); // Clear promotion list
    dispatch(resetAssignState());
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      
      if (!selectedPromotion) {
        message.error('Please select a promotion');
        return;
      }

      if (selectedCoupons.length === 0) {
        message.error('Please select at least one coupon');
        return;
      }

      const storeId = localStorage.getItem('storeId') || '550e8400-e29b-41d4-a716-446655440000';
      
      const assignRequest: CouponAssignRequest = {
        promotionId: selectedPromotion,
        couponIds: selectedCoupons,
      };

      console.log('🔗 Submitting assign request:', {
        storeId,
        promotionId: selectedPromotion,
        couponIds: selectedCoupons
      });

      dispatch(assignCouponsStart({ storeId, assignRequest }));
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const getDiscountTypeLabel = (discountType: number, value: number) => {
    switch (discountType) {
      case 0:
        return `${value}%`;
      case 1:
        return `${value?.toLocaleString()}đ`;
      case 2:
        return 'Free Shipping';
      default:
        return 'Unknown';
    }
  };

  const getDiscountTypeColor = (discountType: number) => {
    switch (discountType) {
      case 0:
        return 'orange';
      case 1:
        return 'green';
      case 2:
        return 'blue';
      default:
        return 'default';
    }
  };

  // Filter active coupons only
  const availableCoupons: CouponOption[] = coupons
    .filter(coupon => coupon.is_active)
    .map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      value: coupon.value,
      is_active: coupon.is_active,
    }));

  return (
    <Modal
      title={
        <Space>
          <LinkOutlined />
          <span>Gán Coupons vào Promotion</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={assignLoading}
          onClick={handleSubmit}
          icon={<CheckCircleOutlined />}
        >
          Gán Coupons
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        {/* Promotion Selection */}
        <Form.Item
          label="Promotion"
          name="promotionId"
          rules={[{ required: true, message: 'Please select a promotion' }]}
        >
          {promotionId ? (
            <div style={{ 
              padding: '8px 12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              backgroundColor: '#f5f5f5'
            }}>
              <Text strong>{promotionName || promotionId}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ID: {promotionId}
              </Text>
            </div>
          ) : (
            <Select
                              placeholder="Select promotion"
              value={selectedPromotion}
              onChange={setSelectedPromotion}
              loading={promotionLoading}
              showSearch
              optionFilterProp="children"
              notFoundContent={promotionLoading ? 'Đang tải...' : 'Không có promotion nào'}
            >
              {promotionList.map((promo) => (
                <Option key={promo.id} value={promo.id}>
                  <div>
                    <Text strong>{promo.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {promo.start_date} - {promo.end_date}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Divider />

        {/* Coupon Selection */}
        <Form.Item
          label={
            <Space>
              <span>Select Coupons</span>
                              <Text type="secondary">({availableCoupons.length} available coupons)</Text>
            </Space>
          }
          name="couponIds"
                      rules={[{ required: true, message: 'Please select at least one coupon' }]}
        >
          <Select
            mode="multiple"
                          placeholder="Select coupons to assign to promotion"
            value={selectedCoupons}
            onChange={setSelectedCoupons}
            loading={couponsLoading}
            showSearch
            optionFilterProp="children"
            maxTagCount={3}
            style={{ width: '100%' }}
          >
            {availableCoupons.map((coupon) => (
              <Option key={coupon.id} value={coupon.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{coupon.code}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {coupon.description}
                    </Text>
                  </div>
                  <Tag color={getDiscountTypeColor(coupon.discount_type)}>
                    {getDiscountTypeLabel(coupon.discount_type, coupon.value)}
                  </Tag>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Selected Coupons Summary */}
        {selectedCoupons.length > 0 && (
          <>
            <Divider />
            <div>
              <Title level={5}>Selected Coupons ({selectedCoupons.length})</Title>
              <Space wrap>
                {selectedCoupons.map((couponId) => {
                  const coupon = availableCoupons.find(c => c.id === couponId);
                  if (!coupon) return null;
                  
                  return (
                    <Tag
                      key={couponId}
                      color={getDiscountTypeColor(coupon.discount_type)}
                      style={{ marginBottom: 4 }}
                    >
                      {coupon.code} - {getDiscountTypeLabel(coupon.discount_type, coupon.value)}
                    </Tag>
                  );
                })}
              </Space>
            </div>
          </>
        )}

        {/* Error Alert */}
        {assignError && (
          <Alert
            message="Error assigning coupons"
            description={assignError}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {/* Information Alert */}
        <Alert
          message="Thông tin"
          description={
            <div>
              <p>• Chỉ có thể gán các coupons đang hoạt động (is_active = true)</p>
              <p>• Tất cả coupons phải thuộc cùng một store</p>
              <p>• Coupons không thể được gán nếu đã liên kết với promotion khác</p>
              <p>• Thao tác này sẽ gán TẤT CẢ hoặc KHÔNG coupon nào (không cho phép gán một phần)</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Form>
    </Modal>
  );
};

export default CouponAssignForm; 