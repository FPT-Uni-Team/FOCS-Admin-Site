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
} from "antd";
import dayjs from "dayjs";
import {
  CouponCreationType,
  DiscountType,
  couponCreationOptions,
  discountTypeOptions,
  type CouponDetailType,
} from "../../../type/coupon/coupon";
import styles from "./CouponDetail.module.scss";
import TextArea from "antd/es/input/TextArea";
import TableReuse from "../../common/Table/TableReuse";
import {
  columnsMenuItemNoSort,
  columnsPromotionListNoSort,
} from "../../common/Columns/Colums";
import type { MenuListDataType } from "../../../type/menu/menu";
import type { SelectedTableItems } from "../../promotion/promotionForm/PromotionForm";
import type { PromotionListDataType } from "../../../type/promotion/promotion";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  form: FormInstance;
  couponDetail: CouponDetailType;
}

const CouponDetail: React.FC<Props> = ({ form, couponDetail }) => {
  const couponType = Form.useWatch(["step1", "coupon_type"], form);
  const discountType = Form.useWatch(["step1", "discount_type"], form);

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

  useEffect(() => {
    if (couponDetail) {
      form.setFieldsValue({
        step1: {
          coupon_type: couponDetail.coupon_type,
          description: couponDetail.description,
          discount_type: couponDetail.discount_type,
          value:
            couponDetail.value &&
            couponDetail.value.toLocaleString("vi-VN").replace("đ", ""),
          start_date: couponDetail.start_date
            ? dayjs.utc(couponDetail.start_date).tz("Asia/Ho_Chi_Minh")
            : undefined,
          end_date: couponDetail.end_date
            ? dayjs.utc(couponDetail.end_date).tz("Asia/Ho_Chi_Minh")
            : undefined,
          code: couponDetail.code,
        },
        step2: {
          max_usage: couponDetail.max_usage,
          is_active: couponDetail.is_active,
          accept_for_items: couponDetail.accept_for_items,
          promotion_id: couponDetail.promotion_id,
          minimum_item_quantity: couponDetail.minimum_item_quantity,
          minimum_order_amount:
            couponDetail.minimum_order_amount &&
            couponDetail.minimum_order_amount
              .toLocaleString("vi-VN")
              .replace("đ", ""),
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
    <Form form={form} layout="vertical" name="couponForm" colon={true}>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item label="Coupon Code Type" name={["step1", "coupon_type"]}>
            <Select
              placeholder="Select coupon type"
              options={couponCreationOptions}
              disabled
            />
          </Form.Item>
        </Col>
        {couponType === CouponCreationType.Manual && (
          <Col span={12}>
            <Form.Item label="Coupon Code" name={["step1", "code"]}>
              <Input maxLength={20} disabled />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row gutter={36}>
        <Col span={24}>
          <Form.Item label="Coupon Description" name={["step1", "description"]}>
            <TextArea rows={4} disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <Form.Item name={["step1", "start_date"]} label="Coupon Start Date">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["step1", "end_date"]} label="Coupon End Date">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <Form.Item label="Discount Type" name={["step1", "discount_type"]}>
            <Select options={discountTypeOptions} disabled></Select>
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
          >
            <Input
              addonBefore={
                discountType === DiscountType.Percent ? <>%</> : <>VND</>
              }
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <Form.Item
            label="Minimum Order Value"
            name={["step2", "minimum_order_amount"]}
            normalize={(value) => {
              const rawValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              return formatted;
            }}
          >
            <Input style={{ width: "100%" }} disabled addonBefore={<>VND</>} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Minimum Items Quantity"
            name={["step2", "minimum_item_quantity"]}
            normalize={(value) => {
              return value.replace(/\./g, "").replace(/[^0-9]/g, "");
            }}
          >
            <Input style={{ width: "100%" }} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Max Usage"
            name={["step2", "max_usage"]}
            normalize={(value) => {
              const formatted = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              return formatted;
            }}
          >
            <Input style={{ width: "100%" }} disabled />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name={["step2", "menu_item_select_discount"]}>
        <Row>
          <div className={styles.customTableSelect}>
            <div className={styles.titleSelectCustom}>
              <Typography.Title level={5}>Apply to menu items</Typography.Title>
            </div>
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
            </div>
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
          <Switch disabled />
        </Form.Item>
        <div>Activate coupon immediately</div>
      </div>
    </Form>
  );
};

export default CouponDetail;
