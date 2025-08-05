import { useForm } from "antd/es/form/Form";
import VariantForm from "../../components/variant/VariantForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createVariantStart,
  resetVariantCreate,
} from "../../store/slices/variant/variantCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";

const VariantCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success, error } = useAppSelector((state) => state.variantCreate);

  const handleCreateVariant = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          name: allFormValues.name,
          price: allFormValues.price,
          is_available: allFormValues.is_available ?? true,
          prep_per_time: allFormValues.prep_per_time || undefined,
          quantity_per_time: allFormValues.quantity_per_time || undefined,
        };
        dispatch(createVariantStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create variant success!");
      dispatch(resetVariantCreate());
      navigate("/variants");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantCreate());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine title="New Variant" onCreate={handleCreateVariant} />
      <VariantForm form={form} mode="Create" />
    </>
  );
};

export default VariantCreatePage;