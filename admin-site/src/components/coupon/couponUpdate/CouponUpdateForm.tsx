import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Row,
  Col,
  Space,
  Alert,
  Typography,
  Spin,
  type FormInstance,
} from "antd";
import {
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { RootState } from "../../../store/store";
import { fetchCouponDetailStart, clearCouponDetail } from "../../../store/slices/coupon/couponDetailSlice";
import { clearUpdateCouponState } from "../../../store/slices/coupon/couponUpdateSlice";
import {
  CouponCreationType,
  CouponCreationTypeLabel,
  DiscountType,
  DiscountTypeLabel,
  CouponConditionType,
  CouponConditionTypeLabel,
} from "../../../type/coupon/coupon";
import { getDisabledTime, validateDate } from "../../../helper/formatDate";
import StepBlock from "../../common/Step/StepBlock";
import menuItemService from "../../../services/menuItemService";
import promotionService from "../../../services/promotionService";
import styles from "./CouponUpdateForm.module.scss";

const { Option } = Select;

interface Props {
  form: FormInstance;
  step: number;
}

const CouponUpdateForm: React.FC<Props> = ({ form, step }) => {
  const dispatch = useDispatch();
  const { couponId } = useParams<{ couponId: string }>();
  
  const { error: updateError } = useSelector((state: RootState) => state.couponUpdate);
  const { coupon: couponDetail, loading: detailLoading, error: detailError } = useSelector(
    (state: RootState) => state.couponDetail
  );
  
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  
  const couponType = Form.useWatch(["step1", "coupon_type"], form);
  const discountType = Form.useWatch(["step1", "discount_type"], form);
  const conditionType = Form.useWatch(["step2", "condition_type"], form);

  // Local state for dropdown data
  const [menuItems, setMenuItems] = useState<Array<{id: string, name: string}>>([]);
  const [promotions, setPromotions] = useState<Array<{id: string, title: string}>>([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [loadingPromotions, setLoadingPromotions] = useState(false);

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
      const formData = {
        step1: {
          coupon_type: CouponCreationType.Manual, // Assume manual for existing coupons
          code: couponDetail.code,
          description: couponDetail.description,
          discount_type: couponDetail.discount_type as DiscountType,
          value: couponDetail.value,
          start_date: dayjs(couponDetail.start_date),
          end_date: dayjs(couponDetail.end_date),
        },
        step2: {
          condition_type: CouponConditionType.MinOrderAmount, // Default, should be mapped from API
          condition_value: couponDetail.minimum_order_amount || 0,
          max_usage: couponDetail.max_usage,
          count_used: couponDetail.count_used,
          max_usage_per_user: undefined,
          accept_for_items: couponDetail.accept_for_items ? 
            (Array.isArray(couponDetail.accept_for_items) ? 
              couponDetail.accept_for_items : 
              couponDetail.accept_for_items.split(',').map((item: string) => item.trim()).filter(Boolean)
            ) : undefined,
          promotion_id: couponDetail.promotion_id || '',
          is_active: couponDetail.is_active,
        },
      };

      form.setFieldsValue(formData);
      setIsFormInitialized(true);
    }
  }, [couponDetail, form, isFormInitialized]);

  // Load menu items data
  useEffect(() => {
    const loadMenuItems = async () => {
      setLoadingMenuItems(true);
      try {
        const response = await menuItemService.getListMenuItems({
          page: 1,
          page_size: 100,
          search_by: "",
          search_value: "",
          sort_by: "",
          sort_order: "",
          filters: {}
        });
        
        // Handle response data structure with multiple fallbacks
        const items = response?.data?.items || response?.data?.data || response?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setMenuItems(items.map((item: {id: string, name?: string, title?: string, description?: string}) => ({
            id: item.id || `item_${Math.random()}`,
            name: item.name || item.title || item.description || `Item ${item.id}`
          })));
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Failed to load menu items:', error);
        setMenuItems([]);
      } finally {
        setLoadingMenuItems(false);
      }
    };

    loadMenuItems();
  }, []);

  // Load promotions data  
  useEffect(() => {
    const loadPromotions = async () => {
      setLoadingPromotions(true);
      try {
        const response = await promotionService.getListPromtions({
          page: 1,
          page_size: 100,
          search_by: "",
          search_value: "",
          sort_by: "",
          sort_order: "",
          filters: {}
        });
        
        // Handle response data structure with multiple fallbacks
        const items = response?.data?.items || response?.data?.data || response?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setPromotions(items.map((item: {id: string, title?: string, name?: string, description?: string}) => ({
            id: item.id || `promo_${Math.random()}`,
            title: item.title || item.name || item.description || `Promotion ${item.id}`
          })));
        } else {
          setPromotions([]);
        }
      } catch (error) {
        console.error('Failed to load promotions:', error);
        setPromotions([]);
      } finally {
        setLoadingPromotions(false);
      }
    };

    loadPromotions();
  }, []);

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

  // Show error if failed to load coupon detail or coupon not found
  if (detailError || !couponDetail) {
    return (
      <div className={styles.container}>
        <Alert
          message={detailError ? "Error loading coupon" : "Coupon not found"}
          description={detailError || "The coupon you're trying to edit doesn't exist."}
          type={detailError ? "error" : "warning"}
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
        name="couponUpdateForm"
        colon={true}
      >
        {/* STEP 1: Basic Information */}
        <StepBlock currentStep={step} step={1}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                label="Coupon Type"
                name={["step1", "coupon_type"]}
                rules={[
                  {
                    required: true,
                    message: "Please select coupon type!",
                  },
                ]}
              >
                <Select placeholder="Select coupon type">
                  <Option value={CouponCreationType.AutoGenerate}>
                    {CouponCreationTypeLabel[CouponCreationType.AutoGenerate]}
                  </Option>
                  <Option value={CouponCreationType.Manual}>
                    {CouponCreationTypeLabel[CouponCreationType.Manual]}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {couponType === CouponCreationType.Manual && (
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  label="Coupon Code"
                  name={["step1", "code"]}
                  rules={[
                    { required: true, message: "Please enter coupon code!" },
                    { pattern: /^[A-Z0-9]+$/, message: "Only uppercase letters and numbers allowed" }
                  ]}
                >
                  <Input
                    placeholder="Enter coupon code (e.g., SUMMER2024)"
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={36}>
            <Col span={24}>
              <Form.Item
                label="Coupon Name"
                name={["step1", "description"]}
                rules={[
                  {
                    required: true,
                    message: "Please enter coupon name!",
                  },
                ]}
              >
                <Input placeholder="Enter coupon name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                label="Discount Type"
                name={["step1", "discount_type"]}
                rules={[
                  {
                    required: true,
                    message: "Please select discount type!",
                  },
                ]}
              >
                <Select placeholder="Select discount type">
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
                label={`Discount Value ${discountType === DiscountType.Percent ? '(%)' : '(VND)'}`}
                name={["step1", "value"]}
                rules={[
                  { required: true, message: "Please enter discount value!" },
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
                      ? (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                      : undefined
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                name={["step1", "start_date"]}
                label="Coupon Start Date"
                rules={[
                  {
                    required: true,
                    message: "Please select start date!",
                  },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={() => getDisabledTime()}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["step1", "end_date"]}
                label="Coupon End Date"
                dependencies={[["step1", "start_date"]]}
                rules={[
                  {
                    required: true,
                    message: "Please select end date!",
                  },
                  validateDate({
                    getFieldValue: form.getFieldValue,
                    fieldName: ["step1", "start_date"],
                    message: "End date must be after start date!",
                  }),
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={() => getDisabledTime()}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </StepBlock>

        {/* STEP 2: Conditions & Usage */}
        <StepBlock currentStep={step} step={2}>
          <div className={styles.conditionBlock}>
            <Typography.Title level={5}>Usage Conditions</Typography.Title>
            
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  label="Condition Type"
                  name={["step2", "condition_type"]}
                  rules={[
                    {
                      required: true,
                      message: "Please select condition type!",
                    },
                  ]}
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
                    conditionType === CouponConditionType.MinOrderAmount 
                      ? "Minimum Order Value (VND)" 
                      : "Minimum Items Quantity"
                  }
                  name={["step2", "condition_value"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter condition value!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter value"
                    min={0}
                    style={{ width: '100%' }}
                    formatter={
                      conditionType === CouponConditionType.MinOrderAmount
                        ? (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        : undefined
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={styles.usageBlock}>
            <Typography.Title level={5}>Usage Limits</Typography.Title>
            
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  label="Max Usage"
                  name={["step2", "max_usage"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter max usage!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter max usage"
                    min={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Count Used"
                  name={["step2", "count_used"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter count used!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter count used"
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  label="Max Usage Per User"
                  name={["step2", "max_usage_per_user"]}
                >
                  <InputNumber
                    placeholder="No limit"
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={36}>
              <Col span={24}>
                <Form.Item
                  label="Apply to Items"
                  name={["step2", "accept_for_items"]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select menu items (optional)"
                    loading={loadingMenuItems}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={menuItems.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={36}>
              <Col span={24}>
                <Form.Item
                  label="Link to Promotion"
                  name={["step2", "promotion_id"]}
                >
                  <Select
                    placeholder="Select promotion (optional)"
                    loading={loadingPromotions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={promotions.map(promotion => ({
                      value: promotion.id,
                      label: promotion.title
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles.flexClass}>
              <Form.Item
                name={["step2", "is_active"]}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
              <div>Activate coupon</div>
            </div>
          </div>
        </StepBlock>
      </Form>
    </div>
  );
};

export default CouponUpdateForm;