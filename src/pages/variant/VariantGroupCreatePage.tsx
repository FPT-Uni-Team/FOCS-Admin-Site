import { useForm } from "antd/es/form/Form";
import VariantGroupForm from "../../components/variant/VariantGroupForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createVariantGroupStart,
  resetVariantGroupCreate,
} from "../../store/slices/variant/variantGroupCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";

const VariantGroupCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success, error } = useAppSelector((state) => state.variantGroupCreate);

  const handleCreateVariantGroup = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          name: allFormValues.name,
        };
        dispatch(createVariantGroupStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create variant group success!");
      dispatch(resetVariantGroupCreate());
      navigate("/variant-groups");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantGroupCreate());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine title="New Variant Group" onCreate={handleCreateVariantGroup} />
      <VariantGroupForm form={form} mode="Create" />
    </>
  );
};

export default VariantGroupCreatePage; 