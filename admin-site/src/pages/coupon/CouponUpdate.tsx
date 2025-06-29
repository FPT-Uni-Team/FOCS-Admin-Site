import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponCreateForm from "../../components/coupon/couponCreate/CouponCreateForm";
import {
  createCouponStart,
  resetCreateCoupon,
} from "../../store/slices/coupon/couponCreateSlice";
import {
  CouponStatusLabel,
  type CouponCreateRequest,
  type CouponDetailType,
} from "../../type/coupon/coupon";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  clearCouponDetail,
  fetchCouponDetailStart,
} from "../../store/slices/coupon/couponDetailSlice";
import { clearUpdateCouponState } from "../../store/slices/coupon/couponUpdateSlice";
import { checkCanEdit } from "../../helper/checkStatus";

const CouponUpdatePage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { couponId } = useParams<{ couponId: string }>();
  const { coupon } = useAppSelector((state) => state.couponDetail);
  const { success, error } = useAppSelector((state) => state.couponUpdate);

  const handleModifyDataCoupon = useCallback((): CouponCreateRequest => {
    const allFormValues = form.getFieldsValue();
    console.log("allFormValues", allFormValues);
    const couponData: CouponCreateRequest = {
      coupon_type: allFormValues?.step1?.coupon_type,
      description: allFormValues?.step1?.description?.trim(),
      discount_type: allFormValues?.step1?.discount_type,
      value: Number(allFormValues?.step1?.value),
      start_date: allFormValues?.step1?.start_date?.format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      end_date: allFormValues?.step1?.end_date?.format("YYYY-MM-DD HH:mm:ss"),
      max_usage: Number(allFormValues?.step2?.max_usage) || 1,
      count_used: 0,
      coupon_condition: {
        condition_type: allFormValues?.step2?.condition_type,
        value: Number(allFormValues?.step2?.condition_value) || 0,
      },
      is_active: Boolean(allFormValues?.step2?.is_active),
    };

    if (allFormValues?.step1?.coupon_type === 1) {
      couponData.code = allFormValues?.step1?.code?.trim();
    }
    if (allFormValues?.step2?.max_usage_per_user) {
      couponData.max_usage_per_user = Number(
        allFormValues?.step2?.max_usage_per_user
      );
    }
    if (allFormValues?.step2?.accept_for_items) {
      couponData.accept_for_items = allFormValues.step2.accept_for_items.trim();
    }
    if (allFormValues?.step2?.promotion_id) {
      couponData.promotion_id = String(allFormValues.step2.promotion_id);
    }
    return couponData;
  }, [form]);

  const handleUpdateCoupon = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataCoupon();
        console.log("payloadData", payloadData);
        const storeId =
          localStorage.getItem("storeId") ||
          "550e8400-e29b-41d4-a716-446655440000";
        dispatch(createCouponStart({ couponData: payloadData, storeId }));
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  }, [dispatch, form, handleModifyDataCoupon]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create coupon success!");
      dispatch(resetCreateCoupon());
      navigate("/coupons");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (couponId) {
      dispatch(fetchCouponDetailStart({ storeId: "", couponId }));
    }
    return () => {
      dispatch(clearCouponDetail());
      dispatch(clearUpdateCouponState());
    };
  }, [couponId, dispatch]);

  useEffect(() => {
    dispatch(resetCreateCoupon());
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title={coupon?.code}
        onCreate={handleUpdateCoupon}
        createButtonText="Update"
        status={
          CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
        }
      />
      <ContentInner>
        <CouponCreateForm
          form={form}
          mode="Update"
          canEditField={checkCanEdit(
            CouponStatusLabel[coupon?.status as keyof typeof CouponStatusLabel]
          )}
          couponDetail={coupon as CouponDetailType}
        />
      </ContentInner>
    </>
  );
};

export default CouponUpdatePage;
