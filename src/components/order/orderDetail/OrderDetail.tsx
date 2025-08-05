import React from "react";
import {
  Row,
  Col,
  Card,
  Input,
} from "antd";
import dayjs from "dayjs";
import type { OrderDTO } from "../../../type/order/order";
import {
  getOrderStatusText,
  getOrderTypeText,
  getPaymentStatusText,
} from "../../../type/order/order";
import { formatPrice } from "../../../helper/formatPrice";
import TableReuse from "../../common/Table/TableReuse";
import type { ColumnsType } from "antd/es/table";
import styles from "./OrderDetail.module.scss";
import StatusTag from "../../common/Status/StatusTag";

interface Props {
  orderDetail: OrderDTO;
}

interface OrderDetailItem {
  key: string;
  menu_item_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note?: string;
}

const OrderDetail: React.FC<Props> = ({ orderDetail }) => {
  const orderDetailColumns: ColumnsType<OrderDetailItem> = [
    {
      title: "Menu Item",
      dataIndex: "menu_item_name",
      key: "menu_item_name",
    },
    {
      title: "Variant",
      dataIndex: "variant_name",
      key: "variant_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      align: "right",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      align: "right",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  // Map order details to table data
  const orderDetailsData: OrderDetailItem[] = orderDetail?.order_details?.map((item, index) => ({
    key: item.id || index.toString(),
    menu_item_name: item.menu_item_name,
    variant_name: item.variant_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    note: item.note,
  })) || [];

  // No need for form.setFieldsValue since we're not using form inputs

    return (
    <div className={styles.orderDetailContainer}>
      <Card title="Order Information" className={styles.orderCard}>
        <Row gutter={24}>
          <Col span={6}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Order Code</div>
                             <Input 
                 value={orderDetail?.order_code} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Order Type</div>
                             <Input 
                 value={orderDetail && getOrderTypeText(orderDetail.order_type)} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Order Status</div>
              <div className={styles.statusContainer}>
                {orderDetail && (
                  <StatusTag status={getOrderStatusText(orderDetail.order_status)} />
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Payment Status</div>
              <div className={styles.statusContainer}>
                {orderDetail && (
                  <StatusTag status={getPaymentStatusText(orderDetail.payment_status)} />
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <div className={styles.infoItem}>
              <div className={styles.label}>User ID</div>
                             <Input 
                 value={orderDetail?.user_id} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Created At</div>
                             <Input 
                 value={orderDetail && dayjs(orderDetail.created_at).format("DD/MM/YYYY HH:mm")} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Updated At</div>
                             <Input 
                 value={orderDetail && dayjs(orderDetail.updated_at).format("DD/MM/YYYY HH:mm")} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Created By</div>
                             <Input 
                 value={orderDetail?.created_by} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Updated By</div>
                             <Input 
                 value={orderDetail?.updated_by || '-'} 
                 readOnly 
                 className={styles.infoInput}
               />
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Customer Note</div>
                             <Input.TextArea 
                 value={orderDetail?.customer_note || 'none'} 
                 readOnly 
                 rows={3}
                 className={styles.infoInput}
               />
            </div>
          </Col>
        </Row>
      </Card>

              <Card title="Order Details" className={styles.orderCard}>
          <TableReuse
            columns={orderDetailColumns}
            dataSource={orderDetailsData}
            rowKey="key"
            pagination={false}
            className={styles.orderItemsTable}
          />
        </Card>

        <Card title="Order Summary" className={`${styles.orderCard} ${styles.summaryCard}`}>
          <Row gutter={24}>
            <Col span={6}>
              <div className={styles.infoItem}>
                <div className={styles.label}>Sub Total</div>
                                 <Input 
                   value={orderDetail && formatPrice(orderDetail.sub_total_amount)} 
                   readOnly 
                   className={styles.infoInput}
                 />
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.infoItem}>
                <div className={styles.label}>Tax Amount</div>
                                 <Input 
                   value={orderDetail && formatPrice(orderDetail.tax_amount)} 
                   readOnly 
                   className={styles.infoInput}
                 />
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.infoItem}>
                <div className={styles.label}>Discount Amount</div>
                                 <Input 
                   value={orderDetail && formatPrice(orderDetail.discount_amount)} 
                   readOnly 
                   className={styles.infoInput}
                 />
              </div>
            </Col>
            <Col span={6}>
              <div className={`${styles.infoItem} ${styles.totalAmount}`}>
                <div className={styles.label}>Total Amount</div>
                                 <Input 
                   value={orderDetail && formatPrice(orderDetail.total_amount)} 
                   readOnly 
                   className={styles.infoInput}
                 />
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

export default OrderDetail;