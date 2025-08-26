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
          status: "Chờ xử lý",
          count: orderStatistic.pending_orders,
          color: "#FF9800",
        },
        {
          status: "Đang xử lý",
          count: orderStatistic.inprogress_orders,
          color: "#2196F3",
        },
        {
          status: "Hoàn thành",
          count: orderStatistic.completed_orders,
          color: "#4CAF50",
        },
        {
          status: "Đã hủy",
          count: orderStatistic.cancelled_orders,
          color: "#F44336",
        },
      ]
    : [];

  const paymentMethodColumns: ColumnsType<PaymentMethodData> = [
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Doanh thu",
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
          { period: "Hôm nay", revenue: financeStatistic.daily_revenue },
          { period: "Tuần này", revenue: financeStatistic.weekly_revenue },
          { period: "Tháng này", revenue: financeStatistic.monthly_revenue },
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
            alias: "Doanh thu",
            formatter: (value: number) => formatPrice(value),
          },
        },
      }
    : null;

  if (error) {
    return (
      <div>
        <TitleLine title="Dashboard" />
        <Card>
          <Text type="danger">Lỗi tải dữ liệu: {error}</Text>
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
              title="Tổng đơn hàng hôm nay"
              value={overviewStatistic?.total_orders || 0}
              prefix={<ShoppingCartOutlined />}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu hôm nay"
              value={overviewStatistic?.total_revenue_today || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => formatPrice(Number(value))}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bàn đang sử dụng"
              value={overviewStatistic?.active_tables || 0}
              prefix={<TableOutlined />}
              loading={loading.overviewStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thời gian hoàn thành TB"
              value={orderStatistic?.average_complete_time || 0}
              suffix="phút"
              prefix={<ClockCircleOutlined />}
              loading={loading.orderStatistic}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê đơn hàng theo trạng thái" loading={loading.orderStatistic}>
            {orderStatusData.length > 0 && <Pie {...pieConfig} height={300} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo thời gian" loading={loading.financeStatistic}>
            {columnConfig && <Column {...columnConfig} height={300} />}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê bếp" loading={loading.kitchenStatistic}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Đơn đang chờ"
                  value={kitchenStatistic?.orders_not_in_progress || 0}
                  valueStyle={{ color: "#FF9800" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đơn đang làm"
                  value={kitchenStatistic?.orders_in_progress || 0}
                  valueStyle={{ color: "#2196F3" }}
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="Đơn hoàn thành"
                  value={kitchenStatistic?.completed_orders || 0}
                  valueStyle={{ color: "#4CAF50" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="Đơn đã hủy"
                  value={kitchenStatistic?.cancelled_orders || 0}
                  valueStyle={{ color: "#F44336" }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Món bán chạy nhất" loading={loading.overviewStatistic}>
            {overviewStatistic?.best_selling_item && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Title level={3} style={{ marginBottom: 8 }}>
                  {overviewStatistic.best_selling_item.item_name}
                </Title>
                <Statistic
                  title="Số lượng đã bán"
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
          <Card title="Doanh thu theo phương thức thanh toán" loading={loading.financeStatistic}>
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
                  title="Giá trị hóa đơn trung bình"
                  value={financeStatistic.average_bill_value}
                  formatter={(value) => formatPrice(Number(value))}
                  valueStyle={{ color: "#1890ff" }}
                />
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thông tin bàn" loading={loading.overviewStatistic}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Bàn đang sử dụng"
                  value={overviewStatistic?.active_tables || 0}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<TableOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Bàn trống"
                  value={overviewStatistic?.available_tables || 0}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<TableOutlined />}
                />
              </Col>
              <Col span={24} style={{ marginTop: 16 }}>
                <Statistic
                  title="Tổng số bàn"
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
