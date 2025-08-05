import React, { useEffect } from "react";
import { Form, Input, InputNumber, Switch, Row, Col, type FormInstance } from "antd";
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
        prep_per_time: initData.prep_per_time,
        quantity_per_time: initData.quantity_per_time,
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
              <Input
                placeholder="Enter variant name"
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input price!",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Price must be greater than or equal to 0!",
                },
              ]}
            >
                             <InputNumber
                 placeholder="Enter price"
                 style={{ width: "100%" }}
                 min={0}
                 disabled={isDetail}
               />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Preparation Time (minutes)"
              name="prep_per_time"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Preparation time must be greater than or equal to 0!",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter preparation time"
                style={{ width: "100%" }}
                min={0}
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Quantity per Time"
              name="quantity_per_time"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Quantity per time must be greater than or equal to 0!",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter quantity per time"
                style={{ width: "100%" }}
                min={0}
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
              <Switch 
                checkedChildren="Available" 
                unCheckedChildren="Unavailable"
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default VariantForm;