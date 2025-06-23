import { useState } from 'react';
import { Card, Button, Typography, Space, Row, Col, Alert } from 'antd';
import { LinkOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CouponAssignForm from '../../components/coupon/couponAssign/CouponAssignForm';

const { Title, Paragraph } = Typography;

function CouponAssignPage() {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const handleBack = () => {
    navigate('/coupons');
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Quay lại
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Gán Coupons vào Promotion
            </Title>
          </Space>
        </Col>
      </Row>

      {/* Introduction Card */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4}>
            <LinkOutlined /> Tính năng Gán Coupons vào Promotion
          </Title>
          
          <Paragraph>
            Tính năng này cho phép bạn gán một hoặc nhiều coupons vào một promotion cụ thể 
            trong cửa hàng. Điều này giúp quản lý các chương trình khuyến mãi một cách hiệu quả.
          </Paragraph>

          <Alert
            message="Yêu cầu hệ thống"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Admin phải có quyền quản lý promotions cho store này</li>
                <li>Promotion phải tồn tại và thuộc về store đã chỉ định</li>
                <li>Tất cả coupons phải tồn tại và thuộc về cùng một store</li>
                <li>Coupons phải đủ điều kiện cho promotion đã chọn (chưa liên kết với promotion khác)</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <Alert
            message="Quy tắc nghiệp vụ"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li><strong>Không cho phép thành công một phần:</strong> Tất cả coupons sẽ được gán hoặc không có coupon nào được gán</li>
                <li><strong>Kiểm tra tính hợp lệ:</strong> Hệ thống sẽ kiểm tra tính hợp lệ của tất cả coupons trước khi thực hiện gán</li>
                <li><strong>Cập nhật cơ sở dữ liệu:</strong> Liên kết sẽ được lưu trữ vĩnh viễn trong cơ sở dữ liệu</li>
              </ul>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* Demo Section */}
      <Card title="Demo Tính Năng" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            Nhấn vào nút bên dưới để mở form gán coupons vào promotion:
          </Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                size="large"
                icon={<LinkOutlined />}
                onClick={handleOpenModal}
                style={{ width: '100%', height: '60px' }}
              >
                Gán Coupons vào Promotion
              </Button>
            </Col>
          </Row>

          <Alert
            message="Hướng dẫn sử dụng"
            description={
              <ol style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Chọn promotion từ danh sách có sẵn</li>
                <li>Chọn một hoặc nhiều coupons từ danh sách coupons đang hoạt động</li>
                <li>Xem lại thông tin đã chọn</li>
                <li>Nhấn "Gán Coupons" để thực hiện</li>
                <li>Hệ thống sẽ xử lý và thông báo kết quả</li>
              </ol>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* API Information */}
      <Card title="Thông tin API" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Endpoint</Title>
            <code style={{ backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
              PUT /admin/coupon/{'{storeId}'}/assign-promotion
            </code>
          </div>

          <div>
            <Title level={5}>Request Body</Title>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "couponIds": ["string", "string", ...],
  "promotionId": "string"
}`}
            </pre>
          </div>

          <div>
            <Title level={5}>Response Codes</Title>
            <ul>
              <li><strong>200 OK:</strong> Gán coupons thành công</li>
              <li><strong>400 Bad Request:</strong> Dữ liệu không hợp lệ</li>
              <li><strong>404 Not Found:</strong> Promotion không tồn tại hoặc coupons không hợp lệ</li>
              <li><strong>401 Unauthorized:</strong> Không có quyền truy cập</li>
            </ul>
          </div>
        </Space>
      </Card>

      {/* Modal */}
      <CouponAssignForm
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default CouponAssignPage; 