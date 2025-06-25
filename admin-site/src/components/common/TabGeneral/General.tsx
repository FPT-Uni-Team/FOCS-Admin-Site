import { useState, type FC } from "react";
import type { PromotionPayload } from "../../../type/promotion/promotion";
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
import { getDisabledTime, validateDate } from "../../../helper/formatDate";
import TableReuse from "../Table/TableReuse";
import { columnsCouponListNoSort } from "../Columns/Colums";

interface Props {
  dataGeneral: PromotionPayload;
  form: FormInstance;
}

const GeneralTab: FC<Props> = ({ dataGeneral, form }) => {
  const useCoupon = Form.useWatch(["step1", "use_coupon"], form);
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
            <TextArea rows={4} placeholder="Enter promotion description" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item
            name={["step1", "start_date"]}
            label="Promotion Start Date"
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
              disabledTime={() => getDisabledTime()}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={["step1", "end_date"]}
            label="Promotion End Date"
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
              disabledTime={() => getDisabledTime()}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <Col span={12}>
          <Form.Item
            label="Promotion type"
            name={["step1", "promotionType"]}
            rules={[
              {
                required: true,
                message: "Please select promotion type!",
              },
            ]}
          >
            <Select placeholder="Select promotion type" />
          </Form.Item>
        </Col>
      </Row>
      <Space direction="vertical">
        <div>
          <Form.Item
            name={["step1", "use_other_promotion"]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Switch />
          </Form.Item>
          <div>Use with other promotions</div>
        </div>
        <div>
          <Form.Item
            name={["step1", "use_coupon"]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Switch />
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
