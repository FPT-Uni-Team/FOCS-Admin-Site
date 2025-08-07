import { useForm } from "antd/es/form/Form";
import VariantGroupDetail from "../../components/variant/variantGroupDetail/VariantGroupDetail";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchVariantGroupDetailStart } from "../../store/slices/variant/variantGroupDetailSlice";

import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

const VariantGroupDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { variantGroupDetail } = useAppSelector((state) => state.variantGroupDetail);

  const { variantGroupId } = useParams<{ variantGroupId: string }>();

  useEffect(() => {
    dispatch(fetchVariantGroupDetailStart(variantGroupId || ""));
  }, [dispatch, variantGroupId]);

  if (!variantGroupDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title={variantGroupDetail.group_name || "Variant Group"}
        onEdit={() => {
          navigate(`/variant-groups/${variantGroupId}/update`);
        }}
        hasMoreAction
      />
      <ContentInner>
        <VariantGroupDetail 
          form={form} 
          variantGroupDetail={variantGroupDetail} 
          mode="View"
        />
      </ContentInner>
    </>
  );
};

export default VariantGroupDetailPage;