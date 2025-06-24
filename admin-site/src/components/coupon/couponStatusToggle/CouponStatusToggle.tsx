import React from 'react';
import { Switch, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCouponStatusRequest, clearSetCouponStatusState } from '../../../store/slices/coupon/couponSetStatusSlice';
import styles from './CouponStatusToggle.module.scss';

interface CouponStatusToggleProps {
  couponId: string;
  isActive: boolean;
  couponCode?: string;
}

const CouponStatusToggle: React.FC<CouponStatusToggleProps> = ({ 
  couponId, 
  isActive, 
  couponCode 
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, response, lastUpdatedCouponId } = useAppSelector(
    (state) => state.couponSetStatus
  );

  // Check if this specific coupon is being updated
  const isCurrentCouponLoading = loading && lastUpdatedCouponId === couponId;

  const handleToggle = async (checked: boolean) => {
    try {
      // Clear any previous error/response state
      dispatch(clearSetCouponStatusState());
      
      // Dispatch action to set coupon status
      dispatch(setCouponStatusRequest({
        couponId,
        isActive: checked
      }));
      
      console.log(`🔄 Toggling coupon status - ID: ${couponId}, Code: ${couponCode}, isActive: ${checked}`);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      message.error('An error occurred while changing coupon status');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Show success message when status is updated successfully
  React.useEffect(() => {
    if (response && lastUpdatedCouponId === couponId && !loading) {
      const statusText = response.data?.isActive ? 'activated' : 'deactivated';
      message.success(`Coupon ${couponCode || couponId} has been ${statusText} successfully!`);
      
      // Clear the response after showing message
      setTimeout(() => {
        dispatch(clearSetCouponStatusState());
      }, 1000);
    }
  }, [response, lastUpdatedCouponId, couponId, loading, couponCode, dispatch]);

  // Show error message when there's an error
  React.useEffect(() => {
    if (error && lastUpdatedCouponId === couponId && !loading) {
      message.error(`Error changing coupon status: ${error}`);
      
      // Clear the error after showing message
      setTimeout(() => {
        dispatch(clearSetCouponStatusState());
      }, 1000);
    }
  }, [error, lastUpdatedCouponId, couponId, loading, dispatch]);

  return (
    <div className={styles.couponStatusToggle} onClick={handleClick}>
      <Switch
        checked={isActive}
        loading={isCurrentCouponLoading}
        onChange={handleToggle}
        checkedChildren="ON"
        unCheckedChildren="OFF"
        className={styles.statusSwitch}
        disabled={isCurrentCouponLoading}
      />
      <span className={`${styles.statusText} ${isActive ? styles.active : styles.inactive}`}>
        {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
      </span>
    </div>
  );
};

export default CouponStatusToggle; 