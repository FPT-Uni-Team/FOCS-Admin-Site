import { useForm } from "antd/es/form/Form";
import VariantGroupDetail from "../../components/variant/variantGroupDetail/VariantGroupDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchVariantGroupDetailStart } from "../../store/slices/variant/variantGroupDetailSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { VariantGroup } from "../../type/variant/variant";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";

const VariantGroupDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { variantGroupDetail } = useAppSelector((state) => state.variantGroupDetail);

  const { variantGroupId } = useParams<{ variantGroupId: string }>();

  useEffect(() => {
    if (variantGroupId) {
      dispatch(fetchVariantGroupDetailStart(variantGroupId));
    }
  }, [variantGroupId, dispatch]);

  return (
    <>
      <TitleLine
        title={variantGroupDetail?.group_name || "Variant Group"}
        onEdit={() => {
          // TODO: Implement edit functionality later
          console.log("Edit button clicked");
        }}
        hasMoreAction
      />
      <ContentInner>
        <VariantGroupDetail 
          form={form} 
          variantGroupDetail={variantGroupDetail as VariantGroup} 
        />
      </ContentInner>
    </>
  );
};

export default VariantGroupDetailPage;