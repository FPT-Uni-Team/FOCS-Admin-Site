import type { FC } from "react";
import TitleLine from "../../common/Title/TitleLine";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { Col, DatePicker, Form, Input, Row, type FormInstance } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getDisabledTime, validateDate } from "../../../helper/formatDate";
import dayjs from "dayjs";

interface Props {
  title?: string;
  mode?: string;
  form: FormInstance;
}

const PromotionForm: FC<Props> = ({ title, mode, form }) => {
  return (
    <>
      <TitleLine title={title} />
      <ContentInner>
        <Form form={form} layout="vertical" name="promotionForm" colon={true}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                label="Promotion Name"
                name="promotionName"
                required
                rules={[
                  { required: true, message: "Please input promotion name!" },
                ]}
              >
                <Input placeholder="Enter promotion name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={24}>
              <Form.Item label="Description" name="description">
                <TextArea rows={4} placeholder="Enter promotion description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                name="start_date"
                label="Promotion Start Date"
                required
                rules={[
                  { required: true, message: "Please select start date!" },
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
                name="end_date"
                label="Promotion End Date"
                dependencies={["start_date"]}
                rules={[
                  validateDate({
                    getFieldValue: form.getFieldValue,
                    fieldName: "start_date",
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
        </Form>
      </ContentInner>
    </>
  );
};
export default PromotionForm;
