import { Col, Form, Input, InputNumber, Row, Select, Switch, Typography, type FormInstance } from "antd";
import React from "react";
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

  React.useEffect(() => {
    if (initData && (mode === "Update" || mode === "Detail")) {
      form.setFieldsValue({
        table_number: initData.table_number,
        qr_code: initData.qr_code,
        status: initData.status,
        is_active: initData.is_active,
        store_id: initData.store_id,
      });
    }
  }, [initData, form, mode]);

  React.useEffect(() => {
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
      <Row gutter={24}>
        <Col span={16}>
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
              {mode === "Update" && (
                <Col span={12}>
                  <Form.Item label="Generate QR Code" name="generate_qr" valuePropName="checked">
                    <Switch disabled={isDetail} />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={36}>
              <Col span={24}>
                <Form.Item
                  label="Store ID"
                  name="store_id"
                  rules={[{ required: true, message: "Please input store ID!" }]}
                >
                  <Input placeholder="Store ID" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="qr_code" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Col>
        
        <Col span={8}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Typography.Title level={4} style={{ marginBottom: "20px" }}>
              QR Code
            </Typography.Title>
            {initData?.qr_code ? (
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  padding: "30px",
                  backgroundColor: "#fafafa",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={initData.qr_code} alt="QR Code" style={{ maxWidth: "150px", maxHeight: "150px" }} />
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed #d9d9d9",
                  borderRadius: "8px",
                  padding: "40px 20px",
                  color: "#999",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                No QR Code available
              </div>
            )}
          </div>
        </Col>
      </Row>
    </ContentInner>
  );
};

export default TableForm;