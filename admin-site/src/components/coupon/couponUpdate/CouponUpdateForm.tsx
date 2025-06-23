import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import type { RootState } from "../../../store/store";
import { updateCouponStart, clearUpdateCouponState } from "../../../store/slices/coupon/couponUpdateSlice";
import { fetchCouponDetailStart, clearCouponDetail } from "../../../store/slices/coupon/couponDetailSlice";
import {
  CouponCreationType,
  CouponCreationTypeLabel,
  DiscountType,
  DiscountTypeLabel,
  CouponConditionType,
  CouponConditionTypeLabel,
  type CouponUpdateRequest,
} from "../../../type/coupon/coupon";
import styles from "./CouponUpdateForm.module.scss";

const { Title } = Typography;
const { Option } = Select;

interface FormData extends Omit<CouponUpdateRequest, 'start_date' | 'end_date' | 'coupon_condition'> {
  start_date: Dayjs;
  end_date: Dayjs;
  condition_type: CouponConditionType;
  condition_value: number;
}

const CouponUpdateForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { couponId } = useParams<{ couponId: string }>();
  const [form] = Form.useForm<FormData>();
  
  const { loading: updateLoading, error: updateError, success: updateSuccess } = useSelector(
    (state: RootState) => state.couponUpdate
  );
  
  const { coupon: couponDetail, loading: detailLoading, error: detailError } = useSelector(
    (state: RootState) => state.couponDetail
  );
  
  const [couponType, setCouponType] = useState<CouponCreationType>(CouponCreationType.AutoGenerate);
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.Percent);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Load coupon detail when component mounts
  useEffect(() => {
    if (couponId) {
      dispatch(fetchCouponDetailStart({ storeId: '', couponId }));
    }
    return () => {
      dispatch(clearCouponDetail());
      dispatch(clearUpdateCouponState());
    };
  }, [couponId, dispatch]);

  // Initialize form with coupon detail data
  useEffect(() => {
    if (couponDetail && !isFormInitialized) {
      // Map coupon detail to form data
      const formData: Partial<FormData> = {
        code: couponDetail.code,
        coupon_type: CouponCreationType.Manual, // Assume manual for existing coupons
        description: couponDetail.description,
        discount_type: couponDetail.discount_type as DiscountType,
        value: couponDetail.value,
        start_date: dayjs(couponDetail.start_date),
        end_date: dayjs(couponDetail.end_date),
        max_usage: couponDetail.max_usage,
        count_used: couponDetail.count_used,
        condition_type: CouponConditionType.MinOrderAmount, // Default, should be mapped from API
        condition_value: couponDetail.minimum_order_amount || 0,
        accept_for_items: couponDetail.accept_for_items || '',
        is_active: couponDetail.is_active,
        promotion_id: couponDetail.promotion_id || '',
      };

      // Set form values
      form.setFieldsValue(formData);
      setCouponType(formData.coupon_type || CouponCreationType.Manual);
      setDiscountType(formData.discount_type || DiscountType.Percent);
      setIsFormInitialized(true);
    }
  }, [couponDetail, form, isFormInitialized]);

  // Handle form submission
  const handleSubmit = useCallback(async (values: FormData) => {
    if (!couponId) {
      message.error('Coupon ID is missing');
      return;
    }

    try {
      // Validate business rules according to API documentation
      if (values.coupon_type === CouponCreationType.Manual && (!values.code || values.code.trim() === '')) {
        message.error('Coupon code must be provided for manual type.');
        return;
      }

      // Validate code format for manual type
      if (values.coupon_type === CouponCreationType.Manual && values.code) {
        const codePattern = /^[A-Z0-9]+$/;
        if (!codePattern.test(values.code.trim())) {
          message.error('Coupon code must contain only uppercase letters and numbers.');
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

      // Prepare request data following API documentation
      const couponData: CouponUpdateRequest = {
        id: couponId,
        code: values.code?.trim() || '',
        coupon_type: values.coupon_type,
        description: values.description.trim(),
        discount_type: values.discount_type,
        value: Number(values.value),
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        max_usage: Number(values.max_usage) || 1,
        count_used: Number(values.count_used) || 0,
        coupon_condition: {
          condition_type: values.condition_type,
          value: Number(values.condition_value) || 0,
        },
        is_active: Boolean(values.is_active),
      };

      // Add optional fields
      if (values.max_usage_per_user && Number(values.max_usage_per_user) > 0) {
        couponData.max_usage_per_user = Number(values.max_usage_per_user);
      }

      if (values.accept_for_items && values.accept_for_items.trim()) {
        couponData.accept_for_items = values.accept_for_items.trim();
      }

      if (values.promotion_id && values.promotion_id.trim()) {
        couponData.promotion_id = values.promotion_id.trim();
      }

      dispatch(updateCouponStart({ couponId, couponData }));
    } catch {
      message.error('Please check your form data and try again.');
    }
  }, [dispatch, couponId]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    dispatch(clearUpdateCouponState());
    navigate("/coupons");
  }, [navigate, dispatch]);

  // Handle success
  useEffect(() => {
    if (updateSuccess) {
      message.success('Coupon được cập nhật thành công!');
      navigate('/coupons', { 
        state: { 
          refresh: true, 
          justUpdated: true
        } 
      });
    }
  }, [updateSuccess, navigate]);

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

  // Show loading spinner while fetching coupon detail
  if (detailLoading || !isFormInitialized) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <p>Loading coupon details...</p>
        </div>
      </div>
    );
  }

  // Show error if failed to load coupon detail
  if (detailError) {
    return (
      <div className={styles.container}>
        <Alert
          message="Error loading coupon"
          description={detailError}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Show error if coupon not found
  if (!couponDetail) {
    return (
      <div className={styles.container}>
        <Alert
          message="Coupon not found"
          description="The coupon you're trying to edit doesn't exist."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          disabled={updateLoading}
          className={styles.backButton}
        >
          Back
        </Button>
      </div>

      <div className={styles.formContainer}>
        <Title level={2} className={styles.title}>
          Update Coupon
        </Title>

        {updateError && (
          <Alert
            message="Error updating coupon"
            description={updateError}
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

          {/* Count Used (Read-only) */}
          <Form.Item
            label="Times Used"
            name="count_used"
            className={styles.formItem}
          >
            <InputNumber
              disabled
              style={{ width: '100%' }}
              placeholder="Number of times this coupon has been used"
            />
          </Form.Item>

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

          {/* Active Status */}
          <Form.Item
            label="Active Status"
            name="is_active"
            valuePropName="checked"
            className={styles.formItem}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          {/* Form Actions */}
          <Form.Item className={styles.formActions}>
            <Space>
              <Button
                type="default"
                onClick={handleBack}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateLoading}
                icon={<SaveOutlined />}
              >
                Update Coupon
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CouponUpdateForm;