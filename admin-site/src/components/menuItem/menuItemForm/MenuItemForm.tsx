import {
  Button,
  Col,
  Input,
  Row,
  Switch,
  Typography,
  type FormInstance,
  Image,
} from "antd";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "./MenuItem.module.scss";
import clsx from "clsx";
import TableReuse from "../../common/Table/TableReuse";
import { columnsCategoryNoSort } from "../../common/Columns/Colums";
import { PlusOutlined } from "@ant-design/icons";
import ModalCategoryList from "../../common/modal/ModalCategoriesList";
import { useState } from "react";
import type { SelectedTableItems } from "../../promotion/promotionForm/PromotionForm";
import type { CategoryListDataType } from "../../../type/category/category";
import ImageUploaderGrid from "../../common/Image/ImageUploaderGrid";
interface Props {
  mode?: "Update" | "Create";
  form: FormInstance;
}
const MenuItemForm: React.FC<Props> = ({ mode = "Create", form }) => {
  const [showModalCategory, setShowModalCategory] = useState<boolean>(false);
  const [dataCategorySeleted, setDataCategorySeleted] = useState<
    SelectedTableItems<CategoryListDataType>
  >({
    keys: [],
    items: [],
  });
  return (
    <Row gutter={12}>
      <Col span={16}>
        <ContentInner>
          <Form form={form} layout="vertical" name="menuItemForm" colon={true}>
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  label="Menu Item Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input menu item name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter menu item name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea
                    rows={4}
                    placeholder="Enter menu item description"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item
                  name="base_price"
                  label="Base price"
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
                      required: true,
                      message: "Please input base price!",
                    },
                  ]}
                >
                  <Input placeholder="From VND" addonBefore={<>VND</>} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className={clsx(styles.flexClass, styles.customSwitch)}>
                  <Form.Item
                    name="is_available"
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch />
                  </Form.Item>
                  <div>Active menu item</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="category_list"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || value.length <= 0) {
                          return Promise.reject("Please select category!");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Row>
                    <div
                      className={clsx(
                        styles.customTableSelect,
                        styles.marginItem
                      )}
                    >
                      <div className={styles.titleSelectCustom}>
                        <Typography.Title level={5}>
                          Select Category
                        </Typography.Title>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => setShowModalCategory(true)}
                        >
                          Select
                        </Button>
                      </div>
                      {showModalCategory && (
                        <>
                          <ModalCategoryList
                            open={showModalCategory}
                            width={1000}
                            onCancel={() => setShowModalCategory(false)}
                            selectedData={dataCategorySeleted.items}
                            selectedDataKey={dataCategorySeleted.keys}
                            handleSubmitModal={(items, keys) => {
                              setShowModalCategory(false);
                              setDataCategorySeleted({
                                keys,
                                items,
                              });
                              form.setFieldsValue({ category_list: keys });
                              form.validateFields(["category_list"]);
                            }}
                          />
                        </>
                      )}
                      <TableReuse
                        columns={columnsCategoryNoSort}
                        dataSource={dataCategorySeleted.items}
                        rowKey="id"
                        pagination={{
                          pageSize: 5,
                        }}
                      />
                    </div>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentInner>
      </Col>
      <Col span={8}>
        <div style={{ minHeight: "fit-content" }}>
          <ContentInner>
            <ImageUploaderGrid />
          </ContentInner>
        </div>
      </Col>
    </Row>
  );
};

export default MenuItemForm;
