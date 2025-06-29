import { useForm } from "antd/es/form/Form";
import CouponDetail from "../../components/coupon/couponDetail/CouponDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCouponDetailStart } from "../../store/slices/coupon/couponDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  CouponStatusLabel,
  type CouponDetailType,
} from "../../type/coupon/coupon";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import { setCouponStatusRequest } from "../../store/slices/coupon/couponSetStatusSlice";

const CouponDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { coupon } = useAppSelector((state) => state.couponDetail);
  const { success } = useAppSelector((state) => state.couponSetStatus);

  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const fetchChangeStatusCoupon = (category: string, couponId: string) => {
    dispatch(
      setCouponStatusRequest({ isActive: category === "active", couponId })
    );
  };

  useEffect(() => {
    if (couponId)
      dispatch(
        fetchCouponDetailStart({
          storeId: "default-store",
          couponId,
        })
      );
  }, [success, couponId, dispatch]);

  console.log("coupon", coupon);

  return (
    <>
      <TitleLine
        title={coupon?.code}
        status={
          CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
        }
        isActive={checkActive(
          CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
        )}
        contentModal="this coupon"
        onAction={fetchChangeStatusCoupon}
        onEdit={() => {
          navigate(`/coupons/${couponId}/edit`);
        }}
        hasMoreAction
        promotionId={couponId}
        isShowEdit={checkShowEdit(
          CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
        )}
      />
      <ContentInner>
        <CouponDetail form={form} couponDetail={coupon as CouponDetailType} />
      </ContentInner>
    </>
  );
};

export default CouponDetailPage;
