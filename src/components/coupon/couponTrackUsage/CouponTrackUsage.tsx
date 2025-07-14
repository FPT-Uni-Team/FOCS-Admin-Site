import React, { useState } from 'react';
import { Button, Modal, message, Typography, Space, Alert, Input, Card, Statistic } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { trackUsageRequest, resetTrackUsageState } from '../../../store/slices/coupon/couponTrackUsageSlice';
import styles from './CouponTrackUsage.module.scss';

const { Title, Text } = Typography;

interface CouponTrackUsageProps {
  couponId: string;
  couponCode: string;
  currentUsageCount: number;
  maxUsage: number;
  isActive: boolean;
  onUsagePreviewd?: () => void;
}

const CouponTrackUsage: React.FC<CouponTrackUsageProps> = ({
  couponId,
  couponCode,
  currentUsageCount,
  maxUsage,
  isActive,
  onUsagePreviewd,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, success, usageData } = useAppSelector(
    (state) => state.couponTrackUsage
  );
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const showModal = () => {
    setIsModalVisible(true);
    dispatch(resetTrackUsageState());
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch(resetTrackUsageState());
    setUserId('');
  };

  const handlePreviewUsage = () => {
    const payload = {
      couponId,
      ...(userId.trim() && { userId: userId.trim() })
    };
    dispatch(trackUsageRequest(payload));
  };

  React.useEffect(() => {
    if (success && usageData) {
      message.success('Coupon usage preview retrieved successfully!');
      onUsagePreviewd?.();
    }
  }, [success, usageData, onUsagePreviewd]);

  React.useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const canPreviewUsage = true; // Always allow preview since it's read-only

  return (
    <>
      <Button
        type="primary"
        icon={<EyeOutlined />}
        onClick={showModal}
        disabled={!canPreviewUsage}
        className={styles.trackButton}
      >
        Preview Usage
      </Button>

      <Modal
        title="Preview Coupon Usage"
        open={isModalVisible}
        onOk={handlePreviewUsage}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Preview"
        cancelText="Cancel"
        className={styles.trackModal}
        width={600}
      >
        <Space direction="vertical" size="middle" className={styles.modalContent}>
          <Title level={4}>Coupon Information</Title>
          
          <div className={styles.infoItem}>
            <Text strong>Coupon Code: </Text>
            <Text>{couponCode}</Text>
          </div>
          
          <div className={styles.infoItem}>
            <Text strong>Current Usage: </Text>
            <Text>{currentUsageCount} / {maxUsage}</Text>
          </div>
          
          <div className={styles.infoItem}>
            <Text strong>Status: </Text>
            <Text className={isActive ? styles.active : styles.inactive}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </div>

          <div className={styles.infoItem}>
            <Text strong>User ID (Optional): </Text>
            <Input
              placeholder="Enter user ID to check specific user usage"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              prefix={<UserOutlined />}
              style={{ width: '100%' }}
            />
          </div>

          <Alert
            message="Preview Information"
            description="This will show remaining usage counts without modifying any data. This is a read-only operation."
            type="info"
            showIcon
          />

          {usageData && (
            <Card title="Usage Preview Results" className={styles.resultsCard}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Statistic
                  title="Total Remaining Uses"
                  value={usageData.totalLeft}
                  suffix={`/ ${usageData.maxUsage}`}
                  valueStyle={{ color: usageData.totalLeft > 0 ? '#3f8600' : '#cf1322' }}
                />
                
                {usageData.leftPerUser !== undefined && (
                  <Statistic
                    title="Remaining Uses for This User"
                    value={usageData.leftPerUser}
                    suffix={usageData.maxUsagePerUser ? `/ ${usageData.maxUsagePerUser}` : ''}
                    valueStyle={{ color: usageData.leftPerUser > 0 ? '#3f8600' : '#cf1322' }}
                  />
                )}
                
                <div className={styles.infoItem}>
                  <Text strong>Current Total Usage: </Text>
                  <Text>{usageData.currentUsage}</Text>
                </div>
                
                {usageData.userUsage !== undefined && (
                  <div className={styles.infoItem}>
                    <Text strong>Current User Usage: </Text>
                    <Text>{usageData.userUsage}</Text>
                  </div>
                )}
              </Space>
            </Card>
          )}

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}
        </Space>
      </Modal>
    </>
  );
};

export default CouponTrackUsage; 