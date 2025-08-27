import { Col, Form, Input, Row, type FormInstance } from "antd";
import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

interface CustomerFormProps {
  form: FormInstance;
  initData?: {
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
  };
}

const CustomerForm: React.FC<CustomerFormProps> = ({ form, initData }) => {
  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        email: initData.email,
        phone_number: initData.phone_number,
        first_name: initData.first_name,
        last_name: initData.last_name,
      });
    }
  }, [initData, form]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="customerForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label="First Name" name="first_name">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="last_name">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone Number" name="phone_number">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default CustomerForm;
