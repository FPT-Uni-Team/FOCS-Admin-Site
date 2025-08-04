import { useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

import TitleLine from "../../components/common/Title/TitleLine";

import { fetchVariantGroupDetailStart } from "../../store/slices/variant/variantGroupDetailSlice";
import {
  updateVariantGroupStart,
  resetVariantGroupUpdate,
} from "../../store/slices/variant/variantGroupUpdateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import VariantGroupDetail from "../../components/variant/variantGroupDetail/VariantGroupDetail";
import type { VariantGroup, VariantGroupUpdateRequest } from "../../type/variant/variant";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

const VariantGroupUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { variantGroupId } = useParams<{ variantGroupId: string }>();

  const { variantGroupDetail } = useAppSelector((state) => state.variantGroupDetail);
  const { success, error } = useAppSelector((state) => state.variantGroupUpdate);

  const handleUpdateVariantGroup = useCallback(() => {
    if (!variantGroupDetail) {
      showNotification("error", "Please wait for data to load before updating");
      return;
    }

    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const originalData = variantGroupDetail;
        const changedFields: Partial<VariantGroupUpdateRequest> = {};
        
        if (values.group_name !== originalData?.group_name) {
          changedFields.name = values.group_name || "";
        }
        
        if (Object.keys(changedFields).length === 0) {
          showNotification("info", "No changes detected");
          return;
        }
        
        dispatch(updateVariantGroupStart({ id: variantGroupId || "", payload: changedFields as VariantGroupUpdateRequest }));
      })
      .catch(() => {});
  }, [dispatch, form, variantGroupId, variantGroupDetail]);

  useEffect(() => {
    if (variantGroupId) {
      dispatch(fetchVariantGroupDetailStart(variantGroupId));
    }
  }, [dispatch, variantGroupId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update variant group success!");
      dispatch(resetVariantGroupUpdate());
      navigate(`/variant-groups/${variantGroupId}`);
    }
  }, [dispatch, navigate, variantGroupId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantGroupUpdate());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine
        title={variantGroupDetail?.group_name || "Variant Group"}
        onCreate={handleUpdateVariantGroup}
        createButtonText="Update"
      />
      <ContentInner>
        <VariantGroupDetail 
          form={form} 
          variantGroupDetail={variantGroupDetail as VariantGroup}
          mode="Update"
        />
      </ContentInner>
    </>
  );
};

export default VariantGroupUpdatePage;