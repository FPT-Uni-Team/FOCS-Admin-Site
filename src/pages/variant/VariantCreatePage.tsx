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
import { useNavigate, useParams } from "react-router-dom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const VariantCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { success, error } = useAppSelector((state) => state.variantCreate);

  const handleCreateVariant = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          name: allFormValues.name,
          price: allFormValues.price.replaceAll(".", ""),
          is_available: allFormValues.is_available ?? true,
        };
        dispatch(createVariantStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create variant success!");
      dispatch(resetVariantCreate());
      navigate(`/${storeId}/variants`);
    }
  }, [dispatch, navigate, success, storeId]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantCreate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Variants",
          link: `/${sessionStorage.getItem("storeId")}/variants`,
        },
        { name: "New Variant" },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <TitleLine title="New Variant" onCreate={handleCreateVariant} />
      <VariantForm form={form} mode="Create" />
    </>
  );
};

export default VariantCreatePage;
