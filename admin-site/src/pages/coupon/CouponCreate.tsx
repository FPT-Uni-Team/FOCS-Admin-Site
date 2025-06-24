import { useForm } from "antd/es/form/Form";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponCreateForm from "../../components/coupon/couponCreate/CouponCreateForm";
import { createCouponStart, resetCreateCoupon } from "../../store/slices/coupon/couponCreateSlice";
import type { RootState } from "../../store/store";
import type { CouponCreateRequest } from "../../type/coupon/coupon";

const CouponCreatePage = () => {
  const [form] = useForm();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { error, success, createdCoupon } = useSelector(
    (state: RootState) => state.couponCreate
  );

  // Clear previous state when component mounts
  useEffect(() => {
    dispatch(resetCreateCoupon());
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

  const handleCreateCoupon = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataCoupon();
        console.log("payloadData", payloadData);
        const storeId = localStorage.getItem('storeId') || '550e8400-e29b-41d4-a716-446655440000';
        dispatch(createCouponStart({ couponData: payloadData, storeId }));
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  }, [dispatch, form]);

  const handleModifyDataCoupon = (): CouponCreateRequest => {
    const allFormValues = form.getFieldsValue();
    console.log("allFormValues", allFormValues);
    
    const couponData: CouponCreateRequest = {
      coupon_type: allFormValues?.step1?.coupon_type,
      description: allFormValues?.step1?.description?.trim(),
      discount_type: allFormValues?.step1?.discount_type,
      value: Number(allFormValues?.step1?.value),
      start_date: allFormValues?.step1?.start_date?.format('YYYY-MM-DD HH:mm:ss'),
      end_date: allFormValues?.step1?.end_date?.format('YYYY-MM-DD HH:mm:ss'),
      max_usage: Number(allFormValues?.step2?.max_usage) || 1,
      count_used: 0,
      coupon_condition: {
        condition_type: allFormValues?.step2?.condition_type,
        value: Number(allFormValues?.step2?.condition_value) || 0,
      },
      is_active: Boolean(allFormValues?.step2?.is_active),
    };

    // Add code field only for Manual type
    if (allFormValues?.step1?.coupon_type === 1) { // Manual type
      couponData.code = allFormValues?.step1?.code?.trim();
    }

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
    if (success && createdCoupon) {
      message.success('Coupon created successfully!');
      navigate('/coupons', { 
        state: { 
          refresh: true, 
          justCreated: true
        } 
      });
    }
  }, [success, createdCoupon, navigate]);

  // Handle error
  useEffect(() => {
    if (error) {
      message.error(`Error creating coupon: ${error}`);
    }
  }, [error]);

  return (
    <>
      <TitleLine
        title="New Coupon"
        step={step}
        totalSteps={2}
        onNext={handleNextStep}
        onCreate={handleCreateCoupon}
        createButtonText="Create"
        onPrevious={() => setStep(step - 1)}
        isDisableCreate={step === 1}
      />
      <CouponCreateForm form={form} step={step} />
    </>
  );
};

export default CouponCreatePage; 