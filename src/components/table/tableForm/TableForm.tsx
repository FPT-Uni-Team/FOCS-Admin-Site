import { Col, Form, Input, InputNumber, Row, Select, Switch, type FormInstance } from "antd";
import { useEffect } from "react";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import type { TableDTO } from "../../../type/table/table";
import { TableStatus, TableStatusLabel } from "../../../type/table/table";

interface Props {
  mode?: "Create" | "Update" | "Detail";
  form: FormInstance;
  initData?: TableDTO;
}

const tableStatusOptions = Object.entries(TableStatus).map(([, value]) => ({
  label: TableStatusLabel[value as keyof typeof TableStatusLabel],
  value: value,
}));

const TableForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const isDetail = mode === "Detail";
  const isCreate = mode === "Create";

  useEffect(() => {
    if (initData && (mode === "Update" || mode === "Detail")) {
      form.setFieldsValue({
        table_number: initData.table_number,
        status: initData.status,
        is_active: initData.is_active,
        store_id: initData.store_id,
      });
    }
  }, [initData, form, mode]);

  useEffect(() => {
    if (isCreate) {
      const defaultStoreId = localStorage.getItem("storeId") || "550e8400-e29b-41d4-a716-446655440000";
      form.setFieldsValue({
        is_active: true,
        status: TableStatus.Available,
        store_id: defaultStoreId,
      });
    }
  }, [isCreate, form]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="tableForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Table Number"
              name="table_number"
              rules={[
                { required: true, message: "Please input table number!" },
                {
                  type: "number",
                  min: 1,
                  message: "Table number must be greater than 0!",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter table number"
                disabled={isDetail}
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select
                placeholder="Select table status"
                options={tableStatusOptions}
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label="Active" name="is_active" valuePropName="checked">
              <Switch disabled={isDetail} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Store ID"
              name="store_id"
              rules={[{ required: true, message: "Please input store ID!" }]}
            >
              <Input placeholder="Store ID" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default TableForm; 