import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CouponDetail from "../../components/coupon/couponDetail/CouponDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { 
  fetchCouponDetailStart, 
  clearCouponDetail 
} from "../../store/slices/coupon/couponDetailSlice";

const CouponDetailPage = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { coupon, loading, error } = useAppSelector((state) => state.couponDetail);

  useEffect(() => {
    if (couponId) {
      dispatch(fetchCouponDetailStart({ 
        storeId: "default-store", // You can get this from auth state or context
        couponId 
      }));
    }

    return () => {
      dispatch(clearCouponDetail());
    };
  }, [dispatch, couponId]);

  const handleGoBack = () => {
    navigate("/coupons");
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          style={{ marginBottom: "16px" }}
        >
          Quay lại danh sách
        </Button>
      </div>
      
      <CouponDetail 
        coupon={coupon} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default CouponDetailPage;
