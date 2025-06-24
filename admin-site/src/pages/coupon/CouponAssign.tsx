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
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Assign Coupons to Promotion
            </Title>
          </Space>
        </Col>
      </Row>

      {/* Introduction Card */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4}>
            <LinkOutlined /> Assign Coupons to Promotion Feature
          </Title>
          
          <Paragraph>
            This feature allows you to assign one or more coupons to a specific promotion 
            in the store. This helps manage promotional programs efficiently.
          </Paragraph>

          <Alert
            message="System Requirements"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Admin must have permissions to manage promotions for this store</li>
                <li>Promotion must exist and belong to the specified store</li>
                <li>All coupons must exist and belong to the same store</li>
                <li>Coupons must be eligible for the selected promotion (not linked to other promotions)</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <Alert
            message="Business Rules"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li><strong>No partial success allowed:</strong> All coupons will be assigned or no coupons will be assigned</li>
                <li><strong>Validity check:</strong> The system will check the validity of all coupons before assignment</li>
                <li><strong>Database update:</strong> Links will be permanently stored in the database</li>
              </ul>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* Demo Section */}
      <Card title="Feature Demo" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            Click the button below to open the coupon assignment form:
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
                Assign Coupons to Promotion
              </Button>
            </Col>
          </Row>

          <Alert
            message="Usage Instructions"
            description={
              <ol style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Select promotion from the available list</li>
                <li>Select one or more coupons from the active coupons list</li>
                <li>Review the selected information</li>
                <li>Click "Assign Coupons" to execute</li>
                <li>System will process and notify results</li>
              </ol>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* API Information */}
      <Card title="API Information" style={{ marginBottom: 24 }}>
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
              <li><strong>200 OK:</strong> Coupons assigned successfully</li>
              <li><strong>400 Bad Request:</strong> Invalid data</li>
              <li><strong>404 Not Found:</strong> Promotion not found or invalid coupons</li>
              <li><strong>401 Unauthorized:</strong> No access permission</li>
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