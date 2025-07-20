import React, { useEffect } from "react";
import { Col, Form, Input, Row, Switch, Typography, type FormInstance } from "antd";
import { QRCodeSVG } from "qrcode.react";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import type { TableDataType } from "../../../type/table/table";
import { TableStatusLabel } from "../../../type/table/table";
import StatusTag from "../../common/Status/StatusTag";
import styles from "../../menuItem/menuItemForm/MenuItem.module.scss";
import clsx from "clsx";

interface Props {
  form: FormInstance;
  tableDetail: TableDataType;
}

const TableDetail: React.FC<Props> = ({ form, tableDetail }) => {
  useEffect(() => {
    if (tableDetail && tableDetail.id) {
      form.setFieldsValue({
        table_number: tableDetail.table_number,
        qr_code: tableDetail.qr_code,
        status: tableDetail.status,
        is_active: tableDetail.is_active,
        store_id: tableDetail.store_id,
      });
    }
  }, [tableDetail, form]);

  return (
    <Row gutter={12}>
      <Col span={16}>
        <ContentInner>
          <Form form={form} layout="vertical" name="tableDetailForm" colon={true}>
            <Row gutter={36}>
              <Col span={12}>
                <Form.Item label="Table Number" name="table_number">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <StatusTag
                    status={TableStatusLabel[tableDetail.status as keyof typeof TableStatusLabel]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={24}>
                <Form.Item label="Store ID" name="store_id">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={12}>
                <div className={clsx(styles.flexClass, styles.customSwitch)}>
                  <Form.Item
                    name="is_active"
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch disabled />
                  </Form.Item>
                  <div>Active table</div>
                </div>
              </Col>
            </Row>
          </Form>
        </ContentInner>
      </Col>
      <Col span={8}>
        <div style={{ minHeight: "fit-content" }}>
          <ContentInner>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Typography.Title level={5} style={{ marginBottom: "20px" }}>
                QR Code
              </Typography.Title>
              {tableDetail.qr_code ? (
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#fafafa",
                    minHeight: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <QRCodeSVG value={tableDetail.qr_code} />
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
                  }}
                >
                  No QR Code available
                </div>
              )}
            </div>
          </ContentInner>
        </div>
      </Col>
    </Row>
  );
};

export default TableDetail; 