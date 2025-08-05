import { useForm } from "antd/es/form/Form";
import VariantDetail from "../../components/variant/variantDetail/VariantDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchVariantDetailStart, clearVariantDetail } from "../../store/slices/variant/variantDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import type { Variant } from "../../type/variant/variant";

const VariantDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { variant, loading } = useAppSelector((state) => state.variantDetail);

  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (variantId) {
      dispatch(fetchVariantDetailStart({ variantId }));
    }
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearVariantDetail());
    };
  }, [variantId, dispatch]);

  if (loading || !variant) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title={variant.name}
        status={variant.is_available ? "Available" : "Unavailable"}
        isActive={variant.is_available ? 1 : 0}
        contentModal="this variant"
        onEdit={() => {
          navigate(`/variants/${variantId}/update`);
        }}
        hasMoreAction={false}
        promotionId={variantId}
        isShowEdit={true}
      />
      <ContentInner>
        <VariantDetail form={form} variantDetail={variant as Variant} />
      </ContentInner>
    </>
  );
};

export default VariantDetailPage;