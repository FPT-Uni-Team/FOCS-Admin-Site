import { Col, Form, Input, InputNumber, Row, Select, Switch, Upload, type FormInstance } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { categoryOptions } from "../../../type/menuItem/menuItem";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";

const { TextArea } = Input;

interface MenuItemCreateFormProps {
  form: FormInstance;
}

const MenuItemCreateForm: FC<MenuItemCreateFormProps> = ({ form }) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ContentInner>
      <Form
        form={form}
        layout="vertical"
        name="menuItemCreateForm"
        initialValues={{
          is_available: true,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Menu Item Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input menu item name!",
                },
                {
                  max: 100,
                  message: "Name must be less than 100 characters!",
                },
              ]}
            >
              <Input placeholder="Enter menu item name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Base Price (VND)"
              name="base_price"
              rules={[
                {
                  required: true,
                  message: "Please input base price!",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Price must be greater than 0!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter base price"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  max: 255,
                  message: "Description must be less than 255 characters!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Short description of the item (optional)"
                showCount
                maxLength={255}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category_ids"
              rules={[
                {
                  required: true,
                  message: "Please select category!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select categories"
                options={categoryOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Image" 
              name="images"
              rules={[
                {
                  required: true,
                  message: "Please upload an image!",
                },
              ]}
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
              normalize={(value) => {
                if (value && value.length > 0) {
                  return "uploaded_image_url";
                }
                return undefined;
              }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                accept=".jpg,.jpeg,.png,.webp"
                beforeUpload={() => false}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Available"
              name="is_available"
              valuePropName="checked"
              extra="Whether the item is visible on ordering screen"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default MenuItemCreateForm; 