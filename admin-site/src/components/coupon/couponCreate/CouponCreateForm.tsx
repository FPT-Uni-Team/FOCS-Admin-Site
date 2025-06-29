import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Row,
  Col,
  type FormInstance,
  Typography,
  Button,
} from "antd";
import dayjs from "dayjs";
import {
  CouponCreationType,
  DiscountType,
  CouponConditionType,
  couponCreationOptions,
  discountTypeOptions,
  couponConditionOptions,
  type CouponDetailType,
} from "../../../type/coupon/coupon";
import { getDisabledTime, validateDate } from "../../../helper/formatDate";
import styles from "./CouponCreateForm.module.scss";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import ModalMenuItem from "../../common/modal/ModalMenuItem";
import TableReuse from "../../common/Table/TableReuse";
import {
  columnsMenuItemNoSort,
  columnsPromotionListNoSort,
} from "../../common/Columns/Colums";
import type { MenuListDataType } from "../../../type/menu/menu";
import type { SelectedTableItems } from "../../promotion/promotionForm/PromotionForm";
import type { PromotionListDataType } from "../../../type/promotion/promotion";
import ModalPromotionList from "../../common/modal/ModalPromotionList";

interface Props {
  form: FormInstance;
  mode?: "Update" | "Create";
  couponDetail?: CouponDetailType;
  canEditField?: number;
}

const CouponCreateForm: React.FC<Props> = ({
  form,
  mode = "Create",
  couponDetail,
  canEditField,
}) => {
  const couponType = Form.useWatch(["step1", "coupon_type"], form);
  const discountType = Form.useWatch(["step1", "discount_type"], form);
  const conditionType = Form.useWatch(["step2", "condition_type"], form);
  const [showModalMenuItem, setShowModalMenuItem] = useState<boolean>(false);
  const [showModalPromotion, setShowModalPromotion] = useState<boolean>(false);

  const [dataMenuItemSeleted, setDataMenuItemSeleted] = useState<
    SelectedTableItems<MenuListDataType>
  >({
    keys: [],
    items: [],
  });

  const [dataPromotionSeleted, setDataPromotionSeleted] = useState<
    SelectedTableItems<PromotionListDataType>
  >({
    keys: [],
    items: [],
  });

  const disableField =
    mode == "Update" &&
    (canEditField == 0 ? true : canEditField == 2 ? false : true);
  const disableFieldEndDate =
    mode == "Update" && (canEditField == 0 ? true : false);

  useEffect(() => {
    if (couponDetail) {
      form.setFieldsValue({
        step1: {
          coupon_type: couponDetail.coupon_type,
          description: couponDetail.description,
          discount_type: couponDetail.discount_type,
          value: couponDetail.value,
          start_date: couponDetail.start_date
            ? dayjs(couponDetail.start_date)
            : undefined,
          end_date: couponDetail.end_date
            ? dayjs(couponDetail.end_date)
            : undefined,
          code: couponDetail.code,
        },
        step2: {
          max_usage: couponDetail.max_usage,
          is_active: couponDetail.is_active,
          condition_type: couponDetail.coupon_condition?.condition_type,
          condition_value: couponDetail.coupon_condition?.value,
          accept_for_items: couponDetail.accept_for_items,
          promotion_id: couponDetail.promotion_id,
        },
      });
      setDataPromotionSeleted({
        keys: couponDetail?.promotion_id ? [couponDetail.promotion_id] : [],
        items: couponDetail?.promotion || [],
      });
      setDataMenuItemSeleted({
        keys: couponDetail?.accept_for_items,
        items: couponDetail?.accept_for_items_list,
      });
    }
  }, [couponDetail, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="couponForm"
      colon={true}
      initialValues={{
        step1: {
          discount_type: DiscountType.FixedAmount,
        },
        step2: {
          is_active: true,
          condition_type: CouponConditionType.MinOrderAmount,
        },
      }}
    >
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item
            label="Coupon Code Type"
            name={["step1", "coupon_type"]}
            rules={[
              {
                required: true,
                message: "Please select coupon code type!",
              },
            ]}
          >
            <Select
              placeholder="Select coupon type"
              options={couponCreationOptions}
              disabled={disableField}
            />
          </Form.Item>
        </Col>
        {couponType === CouponCreationType.Manual && (
          <Col span={12}>
            <Form.Item
              label="Coupon Code"
              name={["step1", "code"]}
              rules={[
                { required: true, message: "Please enter coupon code!" },
                {
                  pattern: /^[A-Z0-9]+$/,
                  message: "Only uppercase letters and numbers allowed",
                },
              ]}
            >
              <Input
                placeholder="Enter coupon code (e.g., SUMMER2024)"
                maxLength={20}
                disabled={disableField}
              />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row gutter={36}>
        <Col span={24}>
          <Form.Item
            label="Coupon Description"
            name={["step1", "description"]}
            rules={[
              {
                required: true,
                message: "Please enter coupon name!",
              },
            ]}
          >
            <TextArea
              placeholder="Enter coupon description"
              rows={4}
              disabled={disableField}
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
              format="DD/MM/YYYY HH:mm"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              disabledTime={(current) => getDisabledTime(current)}
              style={{ width: "100%" }}
              disabled={disableField}
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
              format="DD/MM/YYYY HH:mm"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              disabledTime={(current) => getDisabledTime(current)}
              style={{ width: "100%" }}
              disabled={disableFieldEndDate}
            />
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
            <Select
              placeholder="Select discount type"
              options={discountTypeOptions}
              disabled={disableField}
            ></Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Discount Value"
            name={["step1", "value"]}
            normalize={(value) => {
              let formatted;
              if (discountType === DiscountType.FixedAmount) {
                const rawValue = value
                  .replace(/\./g, "")
                  .replace(/[^0-9]/g, "");
                formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              } else {
                formatted = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              }
              return formatted;
            }}
            rules={[
              { required: true, message: "Please enter discount value!" },
              {
                validator: (_, value) => {
                  if (discountType !== DiscountType.FixedAmount) {
                    const numericValue = Number(
                      String(value)?.replace(/\./g, "")
                    );
                    if (numericValue > 100) {
                      return Promise.reject(
                        "Percentage discount cannot exceed 100."
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              addonBefore={
                discountType === DiscountType.Percent ? <>%</> : <>VND</>
              }
              placeholder={
                discountType === DiscountType.Percent
                  ? "Enter percentage (0-100)"
                  : "Enter amount"
              }
              min={0}
              max={discountType === DiscountType.Percent ? 100 : undefined}
              style={{ width: "100%" }}
              disabled={disableField}
            />
          </Form.Item>
        </Col>
      </Row>

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
            <Select
              placeholder="Select condition type"
              options={couponConditionOptions}
              disabled={disableField}
            ></Select>
          </Form.Item>
        </Col>
        <Col span={6}>
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
            normalize={(value) => {
              let formatted;
              if (conditionType === CouponConditionType.MinOrderAmount) {
                const rawValue = value
                  .replace(/\./g, "")
                  .replace(/[^0-9]/g, "");
                formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              } else {
                formatted = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              }
              return formatted;
            }}
          >
            <Input
              placeholder="Enter value"
              style={{ width: "100%" }}
              disabled={disableField}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Max Usage"
            name={["step2", "max_usage"]}
            rules={[
              {
                required: true,
                message: "Please enter max usage!",
              },
            ]}
            normalize={(value) => {
              const formatted = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              return formatted;
            }}
          >
            <Input
              placeholder="Enter max usage"
              style={{ width: "100%" }}
              disabled={disableField}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name={["step2", "accept_for_items"]}>
        <Row>
          <div className={styles.customTableSelect}>
            <div className={styles.titleSelectCustom}>
              <Typography.Title level={5}>Apply to menu items</Typography.Title>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setShowModalMenuItem(true)}
                disabled={disableField}
              >
                Select
              </Button>
            </div>
            {showModalMenuItem && (
              <ModalMenuItem
                open={showModalMenuItem}
                width={1000}
                onCancel={() => setShowModalMenuItem(false)}
                selectedData={dataMenuItemSeleted.items}
                selectedDataKey={dataMenuItemSeleted.keys}
                handleSubmitModal={(items, keys) => {
                  setShowModalMenuItem(false);
                  setDataMenuItemSeleted({
                    keys,
                    items,
                  });
                  form.setFieldsValue({
                    step2: {
                      accept_for_items: keys,
                    },
                  });
                }}
              />
            )}
            <TableReuse
              columns={columnsMenuItemNoSort}
              dataSource={dataMenuItemSeleted.items}
              rowKey="menuId"
              pagination={{
                pageSize: 5,
              }}
            />
          </div>
        </Row>
      </Form.Item>

      <Form.Item name={["step2", "promotion_id"]}>
        <Row>
          <div className={styles.customTableSelect}>
            <div className={styles.titleSelectCustom}>
              <Typography.Title level={5}>Apply to promotion</Typography.Title>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setShowModalPromotion(true)}
                disabled={disableField}
              >
                Select
              </Button>
            </div>
            {showModalPromotion && (
              <ModalPromotionList
                singleSelectMode={true}
                open={showModalPromotion}
                width={1000}
                onCancel={() => setShowModalPromotion(false)}
                selectedData={dataPromotionSeleted.items}
                selectedDataKey={dataPromotionSeleted.keys}
                handleSubmitModal={(items, keys) => {
                  setShowModalPromotion(false);
                  setDataPromotionSeleted({
                    keys,
                    items,
                  });
                  form.setFieldsValue({
                    step2: {
                      promotion_id: keys,
                    },
                  });
                }}
              />
            )}
            <TableReuse
              columns={columnsPromotionListNoSort}
              dataSource={dataPromotionSeleted.items}
              rowKey="promotionId"
              pagination={{
                pageSize: 5,
              }}
            />
          </div>
        </Row>
      </Form.Item>

      <div className={styles.flexClass}>
        <Form.Item
          name={["step2", "is_active"]}
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch disabled={disableField} />
        </Form.Item>
        <div>Activate coupon immediately</div>
      </div>
    </Form>
  );
};

export default CouponCreateForm;
