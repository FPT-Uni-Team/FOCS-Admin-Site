import { Col, Form, Input, Row, type FormInstance, Card, Table, Tag } from "antd";
import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppSelector } from "../../hooks/redux";
import { formatPrice } from "../../helper/formatPrice";

interface Props {
  mode?: "Update" | "Create" | "Detail";
  form: FormInstance;
  initData?: VariantGroup;
}

const VariantGroupForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const { variantGroupsList } = useAppSelector((state) => state.variantGroup);
  
  useEffect(() => {
    if (initData && (mode == "Update" || mode == "Detail")) {
      form.setFieldsValue({
        name: initData.group_name,
      });
    }
  }, [initData, form, mode]);

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
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="variantGroupForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Variant Group Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input variant group name!",
                },
                {
                  validator: async (_, value) => {
                    if (value && value.trim().length === 0) {
                      throw new Error("Variant group name cannot be empty");
                    }
                    
                   
                    if (mode === "Create" && value) {
                      const trimmedValue = value.trim();
                      const isDuplicate = variantGroupsList.some(
                        (group: VariantGroup) => group.group_name.toLowerCase() === trimmedValue.toLowerCase()
                      );
                      
                      if (isDuplicate) {
                        throw new Error("Variant group name already exists");
                      }
                    }
                    
                    
                    if (mode === "Update" && value && initData) {
                      const trimmedValue = value.trim();
                      const isDuplicate = variantGroupsList.some(
                        (group: VariantGroup) => 
                          group.id !== initData.id && 
                          group.group_name.toLowerCase() === trimmedValue.toLowerCase()
                      );
                      
                      if (isDuplicate) {
                        throw new Error("Variant group name already exists");
                      }
                    }
                  },
                },
              ]}
            >
              <Input
                placeholder="Enter variant group name"
                disabled={mode == "Detail"}
              />
            </Form.Item>
          </Col>
        </Row>

        {(mode === "Update" || mode === "Detail") && initData && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="Variants" size="small">
                <Table
                  columns={variantColumns}
                  dataSource={initData.variants || []}
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
        )}
      </Form>
    </ContentInner>
  );
};

export default VariantGroupForm; 