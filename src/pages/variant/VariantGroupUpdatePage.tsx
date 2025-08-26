import { useForm } from "antd/es/form/Form";
import VariantGroupForm from "../../components/variant/VariantGroupForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { fetchVariantGroupDetailStart } from "../../store/slices/variant/variantGroupDetailSlice";
import {
  updateVariantGroupStart,
  resetVariantGroupUpdate,
} from "../../store/slices/variant/variantGroupUpdateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const VariantGroupUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { variantGroupId, storeId } = useParams<{
    variantGroupId: string;
    storeId: string;
  }>();

  const { variantGroupDetail } = useAppSelector(
    (state) => state.variantGroupDetail
  );
  const { success, error } = useAppSelector(
    (state) => state.variantGroupUpdate
  );

  const handleUpdateVariantGroup = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          id: variantGroupId || "",
          name: allFormValues.name,
        };
        dispatch(updateVariantGroupStart(dataPayload));
      })
      .catch(() => {});
  }, [variantGroupId, dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update variant group success!");
      dispatch(resetVariantGroupUpdate());
      navigate(`/${storeId}/variant-groups/${variantGroupId}`);
    }
  }, [dispatch, navigate, variantGroupId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantGroupUpdate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(fetchVariantGroupDetailStart(variantGroupId || ""));
  }, [dispatch, variantGroupId]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Variant Groups",
          link: `/${localStorage.getItem("storeId")}/variant-groups`,
        },
        {
          name: variantGroupDetail?.group_name ?? "Unnamed Group",
        },
      ])
    );
  }, [variantGroupDetail, dispatch]);

  return (
    <>
      <TitleLine
        title={variantGroupDetail?.group_name || "Variant Group"}
        onCreate={handleUpdateVariantGroup}
        createButtonText="Update"
      />
      <VariantGroupForm
        form={form}
        mode="Update"
        initData={variantGroupDetail || undefined}
      />
    </>
  );
};

export default VariantGroupUpdatePage;
