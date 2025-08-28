import { useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Typography } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/charts";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchOrderStatisticStart,
  fetchOverviewStatisticStart,
  fetchKitchenStatisticStart,
  fetchFinanceStatisticStart,
} from "../../store/slices/dashboard/dashboardSlice";
import TitleLine from "../../components/common/Title/TitleLine";
import { formatPrice } from "../../helper/formatPrice";
import type { ColumnsType } from "antd/es/table";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const { Title, Text } = Typography;

interface PaymentMethodData {
  payment_method: string;
  total_revenue: number;
}

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    orderStatistic,
    overviewStatistic,
    kitchenStatistic,
    financeStatistic,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const params = { today: true };
    dispatch(fetchOrderStatisticStart(params));
    dispatch(fetchOverviewStatisticStart(params));
    dispatch(fetchKitchenStatisticStart(params));
    dispatch(fetchFinanceStatisticStart());
  }, [dispatch]);

  const orderStatusData = orderStatistic
    ? [
        {
          status: "Pending",
          count: orderStatistic.pending_orders,
          color: "#FF9800",
        },
        {
          status: "In Progress",
          count: orderStatistic.inprogress_orders,
          color: "#2196F3",
        },
        {
          status: "Completed",
          count: orderStatistic.completed_orders,
          color: "#4CAF50",
        },
        {
          status: "Cancelled",
          count: orderStatistic.cancelled_orders,
          color: "#F44336",
        },
      ]
    : [];

  const paymentMethodColumns: ColumnsType<PaymentMethodData> = [
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Revenue",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (value: number) => (
        <Text type="success">{formatPrice(value)}</Text>
      ),
    },
  ];

  const pieConfig = {
    data: orderStatusData,
    angleField: "count",
    colorField: "status",
    radius: 0.8,
    color: orderStatusData.map((item) => item.color),
    label: {
      type: "outer",
      content: "{name} ({percentage})",
    },
    legend: {
      position: "bottom" as const,
    },
    interactions: [{ type: "element-active" }],
  };

  const columnConfig = financeStatistic
    ? {
        data: [
          { period: "Today", revenue: financeStatistic.daily_revenue },
          { period: "This Week", revenue: financeStatistic.weekly_revenue },
          { period: "This Month", revenue: financeStatistic.monthly_revenue },
        ],
        xField: "period",
        yField: "revenue",
        color: "#1890ff",
        columnStyle: {
          radius: [4, 4, 0, 0],
        },
        label: {
          position: "middle" as const,
          style: {
            fill: "#FFFFFF",
            opacity: 0.6,
          },
        },
        meta: {
          revenue: {
            alias: "Revenue",
            formatter: (value: number) => formatPrice(value),
          },
        },
      }
    : null;

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  if (error) {
    return (
      <div>
        <TitleLine title="Dashboard" />
        <Card>
          <Text type="danger">Error loading data: {error}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <TitleLine title="Dashboard" />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders Today"
              value={overviewStatistic?.total_orders || 0}
              prefix={<ShoppingCartOutlined />}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue Today"
              value={overviewStatistic?.total_revenue_today || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => value.toLocaleString("vi-VN")}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Tables"
              value={overviewStatistic?.active_tables || 0}
              prefix={<TableOutlined />}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Completion Time"
              value={orderStatistic?.average_complete_time?.toFixed(2) || 0}
              suffix="minutes"
              prefix={<ClockCircleOutlined />}
              loading={loading.orderStatistic}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Order Statistics by Status"
            loading={loading.orderStatistic}
          >
            {orderStatusData.length > 0 && <Pie {...pieConfig} height={300} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue Over Time" loading={loading.financeStatistic}>
            {columnConfig && <Column {...columnConfig} height={300} />}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Kitchen Statistics" loading={loading.kitchenStatistic}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Pending Orders"
                  value={kitchenStatistic?.orders_not_in_progress || 0}
                  valueStyle={{ color: "#FF9800" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Orders in Progress"
                  value={kitchenStatistic?.orders_in_progress || 0}
                  valueStyle={{ color: "#2196F3" }}
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="Completed Orders"
                  value={kitchenStatistic?.completed_orders || 0}
                  valueStyle={{ color: "#4CAF50" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="Cancelled Orders"
                  value={kitchenStatistic?.cancelled_orders || 0}
                  valueStyle={{ color: "#F44336" }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Best Selling Item" loading={loading.overviewStatistic}>
            {overviewStatistic?.best_selling_item && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Title level={3} style={{ marginBottom: 8 }}>
                  {overviewStatistic.best_selling_item.item_name}
                </Title>
                <Statistic
                  title="Quantity Sold"
                  value={overviewStatistic.best_selling_item.quantity}
                  valueStyle={{ fontSize: "2em", color: "#52c41a" }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Revenue by Payment Method"
            loading={loading.financeStatistic}
          >
            <Table
              columns={paymentMethodColumns}
              dataSource={financeStatistic?.revenue_by_payment_method || []}
              pagination={false}
              size="small"
              rowKey="payment_method"
            />
            {financeStatistic?.average_bill_value && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Statistic
                  title="Average Bill Value"
                  value={financeStatistic.average_bill_value}
                  formatter={(value) => formatPrice(Number(value))}
                  valueStyle={{ color: "#1890ff" }}
                />
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Table Information" loading={loading.overviewStatistic}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Active Tables"
                  value={overviewStatistic?.active_tables || 0}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<TableOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Available Tables"
                  value={overviewStatistic?.available_tables || 0}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<TableOutlined />}
                />
              </Col>
              <Col span={24} style={{ marginTop: 16 }}>
                <Statistic
                  title="Total Tables"
                  value={
                    (overviewStatistic?.active_tables || 0) +
                    (overviewStatistic?.available_tables || 0)
                  }
                  valueStyle={{ color: "#722ed1" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
