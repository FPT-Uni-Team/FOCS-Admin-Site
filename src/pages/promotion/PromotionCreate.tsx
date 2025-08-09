import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionForm from "../../components/promotion/promotionForm/PromotionForm";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createPromotionStart,
  resetCreatePromotion,
} from "../../store/slices/promotion/promotionCreateSlice";
import type { PromotionPayload } from "../../type/promotion/promotion";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const PromotionCreatePage = () => {
  const [form] = useForm();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { success, error } = useAppSelector((state) => state.createPromotion);
  const dispatch = useAppDispatch();

  const validationFieldsByStep: Record<number, string[][]> = {
    1: [
      ["step1", "promotionName"],
      ["step1", "start_date"],
      ["step1", "promotionType"],
      ["step1", "end_date"],
      ["step1", "use_coupon_list"],
    ],
    2: [],
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
  const checkLegitValue = (value: string) => {
    return value !== undefined ? Number(value) : undefined;
  };

  const handleModifyDataPromotion = (): PromotionPayload => {
    const allFormValues = form.getFieldsValue();
    return {
      title: allFormValues?.step1?.promotionName,
      description: allFormValues?.step1?.description,
      start_date: allFormValues?.step1?.start_date?.toISOString(),
      end_date: allFormValues?.step1?.end_date?.toISOString(),
      promotion_scope: allFormValues?.step2?.promotion_scope,
      max_discount_value: checkLegitValue(
        allFormValues?.step2?.max_discount_value
      ),
      max_usage: checkLegitValue(allFormValues?.step2?.max_usage),
      minimum_order_amount: checkLegitValue(
        allFormValues?.step2?.minimun_order_value
      ),
      minimum_item_quantity: checkLegitValue(
        allFormValues?.step2?.minimun_item_in_cart
      ),
      can_apply_combine: allFormValues?.step1?.use_other_promotion,
      promotion_type: allFormValues?.step1?.promotionType,
      discount_value: checkLegitValue(allFormValues?.step2?.discount_value),
      is_active: true,
      accept_for_items: allFormValues?.step2?.menu_item_select_discount,
      promotion_item_condition:
        allFormValues?.step1?.promotionType === 4
          ? {
              buy_item_id: allFormValues?.step2?.menu_item_select_buyX?.[0],
              buy_quantity: checkLegitValue(allFormValues?.step2?.buy_x),
              get_item_id: allFormValues?.step2?.menu_item_select_getY?.[0],
              get_quantity: checkLegitValue(allFormValues?.step2?.get_y),
            }
          : undefined,
      coupon_ids: allFormValues?.step1?.use_coupon_list,
      store_id: "550e8400-e29b-41d4-a716-446655440000",
    };
  };

  const handleCreatePromotion = () => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataPromotion();
        dispatch(createPromotionStart(payloadData));
      })
      .catch(() => {
        showNotification("error", "Create promotion failed!");
      });
  };
  useEffect(() => {
    if (success) {
      showNotification("success", "Create promotion success!");
      dispatch(resetCreatePromotion());
      navigate("/promotions");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCreatePromotion());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Promotions",
          link: `/${localStorage.getItem("storeId")}/promotions`,
        },
        { name: "New Promotion" },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title="New Promotion"
        step={step}
        totalSteps={2}
        onNext={handleNextStep}
        onCreate={handleCreatePromotion}
        onPrevious={() => setStep(step - 1)}
        isDisableCreate={step === 1}
      />
      <PromotionForm form={form} step={step} />
    </>
  );
};

export default PromotionCreatePage;
