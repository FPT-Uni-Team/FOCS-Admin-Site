import { useForm } from "antd/es/form/Form";
import VariantDetail from "../../components/variant/variantDetail/VariantDetail";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { fetchVariantDetailStart } from "../../store/slices/variant/variantDetailSlice";
import {
  updateVariantStart,
  resetVariantUpdate,
} from "../../store/slices/variant/variantUpdateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const VariantUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { variantId, storeId } = useParams<{
    variantId: string;
    storeId: string;
  }>();

  const { variant } = useAppSelector((state) => state.variantDetail);
  const { success, error } = useAppSelector((state) => state.variantUpdate);

  const handleUpdateVariant = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();

        const priceValue = allFormValues.price
          ? parseInt(allFormValues.price.replace(/\./g, ""), 10)
          : 0;

        const prepPerTime =
          allFormValues.prep_per_time && allFormValues.prep_per_time !== ""
            ? parseInt(allFormValues.prep_per_time, 10)
            : null;

        const quantityPerTime =
          allFormValues.quantity_per_time &&
          allFormValues.quantity_per_time !== ""
            ? parseInt(allFormValues.quantity_per_time, 10)
            : null;

        const dataPayload = {
          id: variantId || "",
          name: allFormValues.name,
          price: priceValue,
          is_available: allFormValues.is_available,
          prep_per_time: prepPerTime,
          quantity_per_time: quantityPerTime,
        };
        dispatch(updateVariantStart(dataPayload));
      })
      .catch(() => {});
  }, [variantId, dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update variant success!");
      dispatch(resetVariantUpdate());
      navigate(`/${storeId}/variants/${variantId}`);
    }
  }, [dispatch, navigate, variantId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantUpdate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (variantId) {
      dispatch(fetchVariantDetailStart({ variantId }));
    }
  }, [dispatch, variantId]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Variants",
          link: `/${localStorage.getItem("storeId")}/variants`,
        },
        { name: `${variantId}` },
      ])
    );
  }, [variantId, dispatch]);

  return (
    <>
      <TitleLine
        title={variant?.name || "Variant"}
        onCreate={handleUpdateVariant}
        createButtonText="Update"
      />
      {variant && (
        <VariantDetail form={form} mode="Update" variantDetail={variant} />
      )}
    </>
  );
};

export default VariantUpdatePage;
