import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Alert,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import type { RootState } from "../../../store/store";
import { createCouponStart, resetCreateCoupon } from "../../../store/slices/coupon/couponCreateSlice";
import {
  CouponCreationType,
  CouponCreationTypeLabel,
  DiscountType,
  DiscountTypeLabel,
  CouponConditionType,
  CouponConditionTypeLabel,
  type CouponCreateRequest,
} from "../../../type/coupon/coupon";
import styles from "./CouponCreateForm.module.scss";

const { Title } = Typography;
const { Option } = Select;

interface FormData extends Omit<CouponCreateRequest, 'start_date' | 'end_date' | 'coupon_condition'> {
  start_date: Dayjs;
  end_date: Dayjs;
  condition_type: CouponConditionType;
  condition_value: number;
}

const CouponCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm<FormData>();
  
  const { loading, error, success, createdCoupon } = useSelector(
    (state: RootState) => state.couponCreate
  );
  
  const [couponType, setCouponType] = useState<CouponCreationType>(CouponCreationType.AutoGenerate);
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.Percent);

  // Handle form submission
  const handleSubmit = useCallback(async (values: FormData) => {
    try {
      const storeId = localStorage.getItem('storeId') || '550e8400-e29b-41d4-a716-446655440000';
      

      
      // Validate business rules according to Confluence specification
      if (values.coupon_type === CouponCreationType.Manual && (!values.code || values.code.trim() === '')) {
        message.error('Coupon code must be provided for manual type.');
        return;
      }

      // Check code uniqueness for Manual type (simple check against mock data)
      if (values.coupon_type === CouponCreationType.Manual && values.code) {
        const existingCodes = ['SUMMER2023', 'WELCOME50', 'FREESHIP']; // This could be fetched from API
        if (existingCodes.includes(values.code.trim().toUpperCase())) {
          message.error('Coupon code already exists. Please choose a different code.');
          return;
        }
      }

      if (!values.start_date || !values.end_date) {
        message.error('Start date and end date are required.');
        return;
      }

      if (values.start_date.isAfter(values.end_date) || values.start_date.isSame(values.end_date)) {
        message.error('End date must be after start date.');
        return;
      }

      if (!values.description || values.description.trim() === '') {
        message.error('Coupon name is required.');
        return;
      }

      if (values.value === undefined || values.value === null || values.value < 0) {
        message.error('Please enter a valid discount value.');
        return;
      }

      if (values.max_usage === undefined || values.max_usage === null || values.max_usage < 0) {
        message.error('Please enter a valid max usage value.');
        return;
      }

      if (values.condition_value === undefined || values.condition_value === null || values.condition_value < 0) {
        message.error('Please enter a valid condition value.');
        return;
      }

      // Prepare request data following Confluence documentation exactly
      const couponData: CouponCreateRequest = {
        coupon_type: values.coupon_type,
        description: values.description.trim(),
        discount_type: values.discount_type,
        value: Number(values.value),
        start_date: values.start_date.format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.end_date.format('YYYY-MM-DD HH:mm:ss'),
        max_usage: Number(values.max_usage) || 1,
        count_used: 0, // Required - initialized as 0 per documentation
        coupon_condition: {
          condition_type: values.condition_type,
          value: Number(values.condition_value) || 0,
        },
        is_active: Boolean(values.is_active),
      };

      // Add code field only for Manual type (required per documentation)
      if (values.coupon_type === CouponCreationType.Manual) {
        if (!values.code || !values.code.trim()) {
          message.error('Coupon code is required for Manual type.');
          return;
        }
        couponData.code = values.code.trim();
      }

      // Add optional fields only if they have meaningful values
      if (values.max_usage_per_user && Number(values.max_usage_per_user) > 0) {
        couponData.max_usage_per_user = Number(values.max_usage_per_user);
      }

      if (values.accept_for_items && values.accept_for_items.trim()) {
        couponData.accept_for_items = values.accept_for_items.trim();
      }

      if (values.promotion_id && values.promotion_id.trim()) {
        couponData.promotion_id = values.promotion_id.trim();
      }

      console.log('📤 Sending coupon data:', JSON.stringify(couponData, null, 2));
      console.log('🔑 Store ID:', storeId);
      console.log('📅 Date validation:');
      console.log('  Start:', values.start_date.format('YYYY-MM-DD HH:mm:ss'));
      console.log('  End:', values.end_date.format('YYYY-MM-DD HH:mm:ss'));
      console.log('  Is End after Start:', values.end_date.isAfter(values.start_date));

      dispatch(createCouponStart({ couponData, storeId }));
    } catch {
      message.error('Please check your form data and try again.');
    }
  }, [dispatch]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    dispatch(resetCreateCoupon());
    navigate("/coupons");
  }, [navigate, dispatch]);

  // Handle success
  React.useEffect(() => {
    if (success && createdCoupon) {
      message.success('Coupon được tạo thành công!');
      navigate('/coupons', { 
        state: { 
          refresh: true, 
          justCreated: true
        } 
      });
    }
  }, [success, createdCoupon, navigate]);

  // Handle coupon type change
  const handleCouponTypeChange = useCallback((value: CouponCreationType) => {
    setCouponType(value);
    if (value === CouponCreationType.AutoGenerate) {
      form.setFieldValue('code', '');
    }
  }, [form]);

  // Handle discount type change
  const handleDiscountTypeChange = useCallback((value: DiscountType) => {
    setDiscountType(value);
    form.setFieldValue('value', undefined);
  }, [form]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          disabled={loading}
          className={styles.backButton}
        >
          Back
        </Button>
      </div>

      <div className={styles.formContainer}>
        <Title level={2} className={styles.title}>
          Create Coupon
        </Title>

        {error && (
          <Alert
            message="Error creating coupon"
            description={error}
            type="error"
            showIcon
            closable
            className={styles.errorAlert}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          initialValues={{
            coupon_type: CouponCreationType.AutoGenerate,
            discount_type: DiscountType.Percent,
            is_active: true,
            max_usage: 1,
            condition_type: CouponConditionType.MinOrderAmount,
            condition_value: 0,
          }}
        >
          {/* Coupon Type */}
          <Form.Item
            label="Coupon Type"
            name="coupon_type"
            rules={[{ required: true, message: 'Please select coupon type' }]}
            className={styles.formItem}
          >
            <Select onChange={handleCouponTypeChange} placeholder="Select coupon type">
              <Option value={CouponCreationType.AutoGenerate}>
                {CouponCreationTypeLabel[CouponCreationType.AutoGenerate]}
              </Option>
              <Option value={CouponCreationType.Manual}>
                {CouponCreationTypeLabel[CouponCreationType.Manual]}
              </Option>
            </Select>
          </Form.Item>

          {/* Coupon Code */}
          {couponType === CouponCreationType.Manual && (
            <Form.Item
              label={
                <span className={styles.required}>
                  * Coupon Code
                </span>
              }
              name="code"
              rules={[
                { required: true, message: 'Please enter coupon code' },
                { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
              ]}
              className={styles.formItem}
            >
              <Input
                placeholder="Enter coupon code (e.g., SUMMER2024)"
                maxLength={20}
              />
            </Form.Item>
          )}

          {/* Description */}
          <Form.Item
            label={
              <span className={styles.required}>
                * Coupon Name
              </span>
            }
            name="description"
            rules={[{ required: true, message: 'Please enter coupon name' }]}
            className={styles.formItem}
          >
            <Input placeholder="Enter coupon name" />
          </Form.Item>

          {/* Discount Type and Value */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Discount Type
                  </span>
                }
                name="discount_type"
                rules={[{ required: true, message: 'Please select discount type' }]}
                className={styles.formItem}
              >
                <Select onChange={handleDiscountTypeChange} placeholder="Select discount type">
                  <Option value={DiscountType.Percent}>
                    <Space>
                      <PercentageOutlined />
                      {DiscountTypeLabel[DiscountType.Percent]}
                    </Space>
                  </Option>
                  <Option value={DiscountType.FixedAmount}>
                    <Space>
                      <DollarOutlined />
                      {DiscountTypeLabel[DiscountType.FixedAmount]}
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Discount Value {discountType === DiscountType.Percent ? '(%)' : '(VNĐ)'}
                  </span>
                }
                name="value"
                rules={[
                  { required: true, message: 'Please enter discount value' },
                  {
                    validator: (_, value) => {
                      if (discountType === DiscountType.Percent && (value < 0 || value > 100)) {
                        return Promise.reject('Percentage must be between 0 and 100');
                      }
                      if (discountType === DiscountType.FixedAmount && value < 0) {
                        return Promise.reject('Amount must be greater than 0');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                className={styles.formItem}
              >
                <InputNumber
                  placeholder={
                    discountType === DiscountType.Percent
                      ? "Enter percentage (0-100)"
                      : "Enter amount"
                  }
                  min={0}
                  max={discountType === DiscountType.Percent ? 100 : undefined}
                  style={{ width: '100%' }}
                  formatter={
                    discountType === DiscountType.FixedAmount
                      ? (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : undefined
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Date Range */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Coupon Start Date
                  </span>
                }
                name="start_date"
                rules={[{ required: true, message: 'Please select start date' }]}
                className={styles.formItem}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Select date"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Coupon End Date
                  </span>
                }
                name="end_date"
                rules={[{ required: true, message: 'Please select end date' }]}
                className={styles.formItem}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Select date"
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue('start_date');
                    return current && startDate && current <= startDate;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Usage Limits */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Max Usage
                  </span>
                }
                name="max_usage"
                rules={[{ required: true, message: 'Please enter max usage' }]}
                className={styles.formItem}
              >
                <InputNumber
                  placeholder="Enter max usage"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Usage Per User"
                name="max_usage_per_user"
                className={styles.formItem}
              >
                <InputNumber
                  placeholder="No limit"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Conditions */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Condition Type
                  </span>
                }
                name="condition_type"
                rules={[{ required: true, message: 'Please select condition type' }]}
                className={styles.formItem}
              >
                <Select placeholder="Select condition type">
                  <Option value={CouponConditionType.MinOrderAmount}>
                    {CouponConditionTypeLabel[CouponConditionType.MinOrderAmount]}
                  </Option>
                  <Option value={CouponConditionType.MinItemsQuantity}>
                    {CouponConditionTypeLabel[CouponConditionType.MinItemsQuantity]}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className={styles.required}>
                    * Condition Value
                  </span>
                }
                name="condition_value"
                rules={[{ required: true, message: 'Please enter condition value' }]}
                className={styles.formItem}
              >
                <InputNumber
                  placeholder="Enter value"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Optional Fields */}
          <Form.Item
            label="Apply to Items"
            name="accept_for_items"
            className={styles.formItem}
          >
            <Input placeholder="e.g., All products, Fashion items..." />
          </Form.Item>

          <Form.Item
            label="Promotion ID"
            name="promotion_id"
            className={styles.formItem}
          >
            <Input placeholder="Enter promotion ID (optional)" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="is_active"
            valuePropName="checked"
            className={styles.formItem}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          {/* Submit Button */}
          <div className={styles.buttonContainer}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              className={styles.submitButton}
            >
              Create Coupon
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CouponCreateForm; 