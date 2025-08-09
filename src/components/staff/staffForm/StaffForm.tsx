import { Col, Form, Input, Row, Select, type FormInstance } from "antd";
import { useEffect } from "react";
import type { StaffDetailPayload } from "../../../type/staff/staff";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";

interface Props {
  mode?: "Create" | "Update" | "Detail";
  form: FormInstance;
  initData?: StaffDetailPayload;
}

const roleOptions = ["kitchenstaff", "staff"];

const StaffForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const isDetail = mode === "Detail";
  const isCreate = mode === "Create";
  const isUpdate = mode === "Update";

  useEffect(() => {
    if (initData && (isUpdate || isDetail)) {
      form.setFieldsValue({
        email: initData.email,
        phone: initData.phone_number,
        first_name: initData.first_name,
        last_name: initData.last_name,
        roles: initData.roles,
      });
    }
  }, [initData, form, isUpdate, isDetail]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="staffForm" colon={true}>
        <Row gutter={36}>
          <Col span={6}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input placeholder="Enter first name" disabled={isDetail} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input placeholder="Enter last name" disabled={isDetail} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter email"
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please input phone number!" },
                {
                  pattern: /^[0-9]{8,15}$/,
                  message:
                    "Phone number must contain only digits (8–15 numbers).",
                },
              ]}
            >
              <Input placeholder="Enter phone number" disabled={isDetail} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: isCreate,
                  message: "Please enter your password!",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message:
                    "Password must be at least 6 characters long, and include at least 1 lowercase letter, 1 uppercase letter, and 1 digit.",
                },
              ]}
            >
              {isDetail ? (
                <Input disabled />
              ) : (
                <Input.Password placeholder="Enter password" />
              )}
            </Form.Item>
          </Col>

          {!isDetail && (
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                dependencies={["password"]}
                rules={[
                  {
                    required: isCreate,
                    message: "Please confirm password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const pwd = getFieldValue("password");
                      if (!pwd && !value) return Promise.resolve();
                      if (pwd === value) return Promise.resolve();
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label="Roles" name="roles">
              {isDetail ? (
                <Input.TextArea
                  disabled
                  autoSize
                  value={initData?.roles?.join(", ")}
                />
              ) : (
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select roles"
                  options={roleOptions.map((role) => ({
                    label: role.charAt(0).toUpperCase() + role.slice(1),
                    value: role,
                  }))}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default StaffForm;
