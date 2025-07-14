import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponCreateForm from "../../components/coupon/couponCreate/CouponCreateForm";
import {
  createCouponStart,
  resetCreateCoupon,
} from "../../store/slices/coupon/couponCreateSlice";
import type { CouponCreateRequest } from "../../type/coupon/coupon";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import { useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../components/common/Notification/ToastCustom";

const CouponCreatePage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, success } = useAppSelector((state) => state.couponCreate);

  useEffect(() => {
    dispatch(resetCreateCoupon());
  }, [dispatch]);

  const handleModifyDataCoupon = useCallback((): CouponCreateRequest => {
    const allFormValues = form.getFieldsValue();
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
      couponData.accept_for_items = allFormValues.step2.accept_for_items;
    }
    if (allFormValues?.step2?.promotion_id) {
      couponData.promotion_id = String(allFormValues.step2.promotion_id);
    }

    if (allFormValues?.step2?.minimum_order_amount) {
      couponData.minimum_order_amount =
        allFormValues?.step2?.minimum_order_amount;
    }
    if (allFormValues?.step2?.minimum_item_quantity) {
      couponData.minimum_item_quantity = Number(
        allFormValues?.step2?.minimum_item_quantity
      );
    }
    return couponData;
  }, [form]);

  const handleCreateCoupon = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataCoupon();
        dispatch(createCouponStart(payloadData));
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

  return (
    <>
      <TitleLine
        title="New Coupon"
        onCreate={handleCreateCoupon}
        createButtonText="Create"
      />
      <ContentInner>
        <CouponCreateForm form={form} mode="Create" />
      </ContentInner>
    </>
  );
};

export default CouponCreatePage;
