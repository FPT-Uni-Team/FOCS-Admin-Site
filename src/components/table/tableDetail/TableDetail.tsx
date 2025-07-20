import React from "react";
import { Col, Row, Typography } from "antd";
import { QRCodeSVG } from "qrcode.react";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import type { TableDataType } from "../../../type/table/table";

interface Props {
  tableDetail: TableDataType;
}

const TableDetail: React.FC<Props> = ({ tableDetail }) => {
  return (
    <Row gutter={12}>
      <Col span={8}>
        <div style={{ minHeight: "fit-content" }}>
          <ContentInner>
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <Typography.Title level={4} style={{ marginBottom: "20px" }}>
                QR Code
              </Typography.Title>
              {tableDetail.qr_code ? (
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    padding: "30px",
                    backgroundColor: "#fafafa",
                    minHeight: "250px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <QRCodeSVG 
                    value={tableDetail.qr_code} 
                    size={180}
                  />
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed #d9d9d9",
                    borderRadius: "8px",
                    padding: "50px 20px",
                    color: "#999",
                    minHeight: "250px",
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