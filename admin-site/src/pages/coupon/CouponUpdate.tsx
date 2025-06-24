import { useForm } from "antd/es/form/Form";
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponUpdateForm from "../../components/coupon/couponUpdate/CouponUpdateForm";
import { updateCouponStart, clearUpdateCouponState } from "../../store/slices/coupon/couponUpdateSlice";
import type { RootState } from "../../store/store";
import type { CouponUpdateRequest } from "../../type/coupon/coupon";

const CouponUpdatePage = () => {
  const [form] = useForm();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { couponId } = useParams<{ couponId: string }>();
  
  const { error, success } = useSelector(
    (state: RootState) => state.couponUpdate
  );

  // Clear previous state when component mounts
  useEffect(() => {
    dispatch(clearUpdateCouponState());
  }, [dispatch]);

  const validationFieldsByStep: Record<number, string[][]> = {
    1: [
      ["step1", "coupon_type"],
      ["step1", "description"],
      ["step1", "discount_type"],
      ["step1", "value"],
      ["step1", "start_date"],
      ["step1", "end_date"],
    ],
    2: [
      ["step2", "condition_type"],
      ["step2", "condition_value"],
      ["step2", "max_usage"],
      ["step2", "count_used"],
    ],
  };

  const handleNextStep = () => {
    const fieldsToValidate = validationFieldsByStep[step];
    form
      .validateFields(fieldsToValidate)
      .then(() => {
        setStep(step + 1);
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const handleUpdateCoupon = useCallback(() => {
    if (!couponId) {
      message.error('Coupon ID is missing');
      return;
    }

    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataCoupon();
        console.log("payloadData", payloadData);
        dispatch(updateCouponStart({ couponId, couponData: payloadData }));
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  }, [dispatch, form, couponId]);

  const handleModifyDataCoupon = (): CouponUpdateRequest => {
    const allFormValues = form.getFieldsValue();
    console.log("allFormValues", allFormValues);
    
    const couponData: CouponUpdateRequest = {
      id: couponId!,
      code: allFormValues?.step1?.code?.trim() || '',
      coupon_type: allFormValues?.step1?.coupon_type,
      description: allFormValues?.step1?.description?.trim(),
      discount_type: allFormValues?.step1?.discount_type,
      value: Number(allFormValues?.step1?.value),
      start_date: allFormValues?.step1?.start_date?.toISOString(),
      end_date: allFormValues?.step1?.end_date?.toISOString(),
      max_usage: Number(allFormValues?.step2?.max_usage) || 1,
      count_used: Number(allFormValues?.step2?.count_used) || 0,
      coupon_condition: {
        condition_type: allFormValues?.step2?.condition_type,
        value: Number(allFormValues?.step2?.condition_value) || 0,
      },
      is_active: Boolean(allFormValues?.step2?.is_active),
    };

    // Add optional fields
    if (allFormValues?.step2?.max_usage_per_user) {
      couponData.max_usage_per_user = Number(allFormValues?.step2?.max_usage_per_user);
    }

    // Handle accept_for_items as array (from multiple select)
    if (allFormValues?.step2?.accept_for_items && Array.isArray(allFormValues?.step2?.accept_for_items)) {
      if (allFormValues.step2.accept_for_items.length > 0) {
        couponData.accept_for_items = allFormValues.step2.accept_for_items.join(',');
      }
    } else if (allFormValues?.step2?.accept_for_items && typeof allFormValues?.step2?.accept_for_items === 'string') {
      // Fallback for string input
      couponData.accept_for_items = allFormValues.step2.accept_for_items.trim();
    }

    // Handle promotion_id as single value
    if (allFormValues?.step2?.promotion_id) {
      couponData.promotion_id = String(allFormValues.step2.promotion_id);
    }

    return couponData;
  };



  // Handle success
  useEffect(() => {
    if (success) {
      message.success('Coupon updated successfully!');
      navigate('/coupons', { 
        state: { 
          refresh: true, 
          justUpdated: true
        } 
      });
    }
  }, [success, navigate]);

  // Handle error
  useEffect(() => {
    if (error) {
      message.error(`Error updating coupon: ${error}`);
    }
  }, [error]);

  return (
    <>
      <TitleLine
        title="Update Coupon"
        step={step}
        totalSteps={2}
        onNext={handleNextStep}
        onCreate={handleUpdateCoupon}
        createButtonText="Update"
        onPrevious={() => setStep(step - 1)}
        isDisableCreate={step === 1}
      />
      <CouponUpdateForm form={form} step={step} />
    </>
  );
};

export default CouponUpdatePage; 