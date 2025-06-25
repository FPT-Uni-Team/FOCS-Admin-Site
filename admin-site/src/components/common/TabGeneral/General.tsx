import { useEffect, type FC } from "react";
import {
  promotionOptions,
  type PromotionPayload,
} from "../../../type/promotion/promotion";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import type { FormInstance } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import TableReuse from "../Table/TableReuse";
import { columnsCouponListNoSort } from "../Columns/Colums";
import styles from "../../promotion/promotionForm/PromotionForm.module.scss";

interface Props {
  dataGeneral: PromotionPayload;
  form: FormInstance;
}

const GeneralTab: FC<Props> = ({ dataGeneral, form }) => {
  const useCoupon = Form.useWatch(["step1", "use_coupon"], form);
  useEffect(() => {
    if (dataGeneral) {
      form.setFieldsValue({
        step1: {
          title: dataGeneral.title,
          description: dataGeneral.description,
          start_date: dayjs(dataGeneral.start_date),
          end_date: dayjs(dataGeneral.end_date),
          promotionType: dataGeneral.promotion_type,
          use_other_promotion: dataGeneral.can_apply_combine,
          use_coupon:
            dataGeneral.coupon_ids && dataGeneral?.coupon_ids?.length > 0,
        },
      });
    }
  }, [dataGeneral, form]);
  return (
    <Form form={form} layout="vertical" name="promotionDetailForm" colon={true}>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item label="Promotion Name" name={["step1", "title"]}>
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <Col span={24}>
          <Form.Item label="Description" name={["step1", "description"]}>
            <TextArea rows={4} disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item
            name={["step1", "start_date"]}
            label="Promotion Start Date"
          >
            <DatePicker
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["step1", "end_date"]} label="Promotion End Date">
            <DatePicker
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item label="Promotion type" name={["step1", "promotionType"]}>
            <Select options={promotionOptions} disabled />
          </Form.Item>
        </Col>
      </Row>
      <Space direction="vertical">
        <div className={styles.flexClass}>
          <Form.Item
            name={["step1", "use_other_promotion"]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Switch disabled />
          </Form.Item>
          <div>Use with other promotions</div>
        </div>
        <div className={styles.flexClass}>
          <Form.Item
            name={["step1", "use_coupon"]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Switch disabled />
          </Form.Item>
          <div>Use coupon for promotion</div>
        </div>
      </Space>
      {useCoupon && (
        <Form.Item name={["step1", "use_coupon_list"]}>
          <Row>
            <div>
              <div>
                <Typography.Title level={5}>Select Coupon</Typography.Title>
              </div>
              <TableReuse
                columns={columnsCouponListNoSort}
                dataSource={[]}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
          </Row>
        </Form.Item>
      )}
    </Form>
  );
};

export default GeneralTab;
