import React, { useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Row,
  Col,
  type FormInstance,
  Card,
  Table,
  Tag,
} from "antd";
import type { VariantGroup } from "../../../type/variant/variant";
import { formatPrice } from "../../../helper/formatPrice";
import styles from "./VariantGroupDetail.module.scss";

interface Props {
  form: FormInstance;
  variantGroupDetail: VariantGroup;
  mode?: "View" | "Update";
}

const VariantGroupDetail: React.FC<Props> = ({ form, variantGroupDetail, mode = "View" }) => {
  const isEditMode = mode === "Update";
  useEffect(() => {
    if (variantGroupDetail) {
      form.setFieldsValue({
        group_name: variantGroupDetail.group_name,
        is_required: variantGroupDetail.is_required,
      });
    }
  }, [variantGroupDetail, form]);

  const variantColumns = [
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      width: "15%",
      render: (is_available: boolean) => (
        <Tag color={is_available ? "green" : "red"}>
          {is_available ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Prep Time (min)",
      dataIndex: "prep_per_time",
      key: "prep_per_time",
      width: "15%",
      render: (prep_per_time: number | undefined) =>
        prep_per_time ? `${prep_per_time} min` : "-",
    },
    {
      title: "Quantity per Time",
      dataIndex: "quantity_per_time",
      key: "quantity_per_time",
      width: "20%",
      render: (quantity_per_time: number | undefined) =>
        quantity_per_time || "-",
    },
  ];

  return (
    <Form form={form} layout="vertical" name="variantGroupDetailForm" colon={true}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Group Name" name="group_name">
            <Input disabled={!isEditMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="is_required"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <div className={styles.switchWrapper}>
              <Switch disabled={!isEditMode} />
              <span>Required Selection</span>
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.variantTable}>
        <Col span={24}>
          <Card title="Variants" size="small">
            <Table
              columns={variantColumns}
              dataSource={variantGroupDetail?.variants || []}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default VariantGroupDetail;