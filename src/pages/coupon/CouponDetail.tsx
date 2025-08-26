import { useForm } from "antd/es/form/Form";
import CouponDetail from "../../components/coupon/couponDetail/CouponDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCouponDetailStart } from "../../store/slices/coupon/couponDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CouponStatusLabel,
  type CouponDetailType,
} from "../../type/coupon/coupon";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import { setCouponStatusRequest } from "../../store/slices/coupon/couponSetStatusSlice";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  deleteCouponStart,
  clearDeleteCouponState,
} from "../../store/slices/coupon/couponDeleteSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const CouponDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { coupon } = useAppSelector((state) => state.couponDetail);
  const { success } = useAppSelector((state) => state.couponSetStatus);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.couponDelete);

  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const fetchChangeStatusCoupon = (category: string, couponId: string) => {
    dispatch(
      setCouponStatusRequest({ isActive: category === "active", couponId })
    );
  };

  const handleDeleteCoupon = () => {
    setIsDeleteModalOpen(true);
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

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete coupon success!");
      navigate(`/${localStorage.getItem("storeId")}/coupons`);
      dispatch(clearDeleteCouponState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteCouponState());
    }
  }, [deleteError, dispatch]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Coupons",
          link: `/${localStorage.getItem("storeId")}/coupons`,
        },
        { name: `${couponId}` },
      ])
    );
  }, [couponId, dispatch]);

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
          navigate(
            `/${localStorage.getItem("storeId")}/coupons/${couponId}/edit`
          );
        }}
        onDelete={handleDeleteCoupon}
        hasMoreAction
        promotionId={couponId}
        isShowEdit={checkShowEdit(
          CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
        )}
        deleteLoading={deleteLoading}
      />
      <ContentInner>
        <CouponDetail form={form} couponDetail={coupon as CouponDetailType} />
      </ContentInner>

      <Modal
        title="Delete Coupon"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteCouponStart({ couponId: couponId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this coupon? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default CouponDetailPage;
