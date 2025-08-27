import { Col, Input, Row, Typography, type FormInstance } from "antd";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "../menuItemForm/MenuItem.module.scss";
import TableReuse from "../../common/Table/TableReuse";
import { columnsCategoryNoSort } from "../../common/Columns/Colums";
import { useEffect, useState } from "react";
import type { SelectedTableItems } from "../../promotion/promotionForm/PromotionForm";
import type { CategoryListDataType } from "../../../type/category/category";
import type { MenuItem } from "../../../type/menu/menu";
import ImageShowGrid, {
  type DisplayImage,
} from "../../common/Image/ImageShowGrid";
import VariantDisplayDetail from "../../common/Variant/VariantShowList";
interface Props {
  form: FormInstance;
  menuItemDetail?: MenuItem;
}

const MenuItemDetailForm: React.FC<Props> = ({ form, menuItemDetail }) => {
  const [dataCategorySeleted, setDataCategorySeleted] = useState<
    SelectedTableItems<CategoryListDataType>
  >({
    keys: [],
    items: [],
  });

  useEffect(() => {
    if (menuItemDetail) {
      form.setFieldsValue({
        name: menuItemDetail.name,
        description: menuItemDetail.description,
        base_price: menuItemDetail.base_price?.toLocaleString("vi-VN"),
      });
      setDataCategorySeleted({
        keys: (menuItemDetail.categories || []).map((item) => item.id),
        items: menuItemDetail.categories || [],
      });
    }
  }, [menuItemDetail, form]);

  return (
    <Row gutter={12}>
      <Col span={16}>
        <ContentInner>
          <Form form={form} layout="vertical" name="menuItemForm" colon={true}>
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item label="Menu Item Name" name="name">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea disabled rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item name="base_price" label="Base price">
                  <Input
                    placeholder="From VND"
                    addonBefore={<>VND</>}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="category_ids">
                  <Row>
                    <div className={styles.customTableSelect}>
                      <div className={styles.titleSelectCustom}>
                        <Typography.Title level={5}>
                          Select Category
                        </Typography.Title>
                      </div>
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
            <Row>
              <Col span={24}>
                <Form.Item name="variant_groups">
                  <Row>
                    <div className={styles.customTableSelect}>
                      <VariantDisplayDetail
                        displayVariantGroups={
                          menuItemDetail?.variant_groups || []
                        }
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
            <ImageShowGrid
              initialImages={(menuItemDetail?.images as DisplayImage[]) || []}
            />
          </ContentInner>
        </div>
      </Col>
    </Row>
  );
};

export default MenuItemDetailForm;
