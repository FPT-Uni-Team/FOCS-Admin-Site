import { Col, Form, Input, InputNumber, Row, type FormInstance } from "antd";
import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import type { CategoryListDataType } from "../../type/category/category";

interface CategoryFormProps {
  form: FormInstance;
  initData?: CategoryListDataType;
  mode?: "Create" | "Update" | "Detail";
}

const CategoryForm: React.FC<CategoryFormProps> = ({ form, initData, mode = "Detail" }) => {
  const isEditable = mode === "Create" || mode === "Update";
  
  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        name: initData.name,
        description: initData.description,
        sort_order: initData.sort_order || 0,
      });
    } else {
      // Set default sort_order for new categories
      form.setFieldsValue({
        sort_order: 0,
      });
    }
  }, [initData, form]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="categoryForm" colon={true}>
        <Row gutter={36}>
          <Col span={24}>
            <Form.Item 
              label="Category Name" 
              name="name"
              rules={isEditable ? [{ required: true, message: "Please enter category name" }] : []}
            >
              <Input disabled={!isEditable} />
            </Form.Item>
          </Col>
        </Row>
        {/* Hidden sort_order field - not displayed but included in form data */}
        <Form.Item name="sort_order" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={36}>
          <Col span={24}>
            <Form.Item 
              label="Description" 
              name="description"
              rules={isEditable ? [{ required: true, message: "Please enter description" }] : []}
            >
              <Input.TextArea disabled={!isEditable} rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default CategoryForm;
