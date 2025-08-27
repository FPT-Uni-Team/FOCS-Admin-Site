import React, { useEffect } from "react";
import { Form, Input, Switch, Row, Col, type FormInstance } from "antd";
import type { Variant } from "../../type/variant/variant";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

interface Props {
  mode?: "Create" | "Update" | "Detail";
  form: FormInstance;
  initData?: Variant;
}

const VariantForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const isDetail = mode === "Detail";

  useEffect(() => {
    if (initData && (mode === "Update" || mode === "Detail")) {
      form.setFieldsValue({
        name: initData.name,
        price: initData.price,
        is_available: initData.is_available,
      });
    }
  }, [initData, form, mode]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="variantForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Variant Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input variant name!",
                },
                {
                  max: 100,
                  message: "Variant name cannot exceed 100 characters!",
                },
              ]}
            >
              <Input placeholder="Enter variant name" disabled={isDetail} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              normalize={(value) => {
                const rawValue = value
                  .replace(/\./g, "")
                  .replace(/[^0-9]/g, "");
                const formatted = rawValue.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                return formatted;
              }}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || Number(value) <= 0) {
                      return Promise.reject(
                        new Error("Value must be greater than 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="From VND"
                addonBefore={<>VND</>}
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Availability"
              name="is_available"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch disabled={isDetail} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default VariantForm;
