import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponCreateForm from "../../components/coupon/couponCreate/CouponCreateForm";

import {
  CouponStatusLabel,
  type CouponDetailType,
  type CouponUpdateRequest,
} from "../../type/coupon/coupon";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  clearCouponDetail,
  fetchCouponDetailStart,
} from "../../store/slices/coupon/couponDetailSlice";
import {
  clearUpdateCouponState,
  updateCouponStart,
} from "../../store/slices/coupon/couponUpdateSlice";
import { checkCanEdit } from "../../helper/checkStatus";

const CouponUpdatePage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { couponId } = useParams<{ couponId: string }>();
  const { coupon } = useAppSelector((state) => state.couponDetail);
  const { success, error } = useAppSelector((state) => state.couponUpdate);

  const handleModifyDataCoupon = useCallback((): CouponUpdateRequest => {
    const allFormValues = form.getFieldsValue();
    const couponData: CouponUpdateRequest = {
      coupon_type: 1,
      description: allFormValues?.step1?.description?.trim(),
      code: coupon?.code,
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
      couponData.minimum_order_amount = Number(
        allFormValues?.step2?.minimum_order_amount
      );
    }
    if (allFormValues?.step2?.minimum_item_quantity) {
      couponData.minimum_item_quantity = Number(
        allFormValues?.step2?.minimum_item_quantity
      );
    }
    return couponData;
  }, [coupon?.code, form]);

  const handleUpdateCoupon = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataCoupon();
        dispatch(
          updateCouponStart({
            couponData: payloadData,
            couponId: couponId as string,
          })
        );
      })
      .catch(() => {});
  }, [couponId, dispatch, form, handleModifyDataCoupon]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update coupon success!");
      navigate(`/coupons/${couponId}`);
    }
  }, [couponId, dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", "Update coupon error!");
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
