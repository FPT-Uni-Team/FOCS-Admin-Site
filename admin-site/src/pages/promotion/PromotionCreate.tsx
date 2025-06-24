import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionForm from "../../components/promotion/promotionForm/PromotionForm";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { createPromotionStart } from "../../store/slices/promotion/promotionCreateSlice";
import type { PromotionPayload } from "../../type/promotion/promotion";

const PromotionCreatePage = () => {
  const [form] = useForm();
  const [step, setStep] = useState(1);
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

  const handleCreatePromotion = () => {
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyDataPromotion();
        dispatch(createPromotionStart(payloadData));
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const checkLegitValue = (value: number) => {
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
      store_id: "550e8400-e29b-41d4-a716-446655440000",
    };
  };

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
