import { Col, Form, Input, Row, type FormInstance } from "antd";

import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TextArea from "antd/es/input/TextArea";
import type { CategoryListDataType } from "../../type/category/category";

interface Props {
  mode?: "Update" | "Create" | "Detail";
  form: FormInstance;
  initData?: CategoryListDataType;
}

const CategoryForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  useEffect(() => {
    if (initData && (mode == "Update" || mode == "Detail")) {
      form.setFieldsValue({
        name: initData.name,
        description: initData.description,
      });
    }
  }, [initData, form, mode]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="categoryForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input category name!",
                },
              ]}
            >
              <Input
                placeholder="Enter category name"
                disabled={mode == "Detail"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={24}>
            <Form.Item label="Description" name="description">
              <TextArea
                rows={4}
                placeholder="Enter category description"
                disabled={mode == "Detail"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default CategoryForm;
