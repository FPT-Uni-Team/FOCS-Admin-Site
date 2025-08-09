import { useForm } from "antd/es/form/Form";
import VariantDetail from "../../components/variant/variantDetail/VariantDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchVariantDetailStart, clearVariantDetail } from "../../store/slices/variant/variantDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import type { Variant } from "../../type/variant/variant";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { deleteVariantStart, clearDeleteVariantState } from "../../store/slices/variant/variantDeleteSlice";

const VariantDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { variant, loading } = useAppSelector((state) => state.variantDetail);
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useAppSelector((state) => state.variantDelete);

  const { variantId, storeId } = useParams<{ variantId: string; storeId: string }>();
  const navigate = useNavigate();

  const handleDeleteVariant = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (variantId) {
      dispatch(fetchVariantDetailStart({ variantId }));
    }
    
    
    return () => {
      dispatch(clearVariantDetail());
    };
  }, [variantId, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete variant success!");
      navigate("/variants");
      dispatch(clearDeleteVariantState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteVariantState());
    }
  }, [deleteError, dispatch]);

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
          navigate(`/${storeId}/variants/${variantId}/update`);
        }}
        onDelete={handleDeleteVariant}
        hasMoreAction={true}
        promotionId={variantId}
        isShowEdit={true}
        deleteLoading={deleteLoading}
      />
      <ContentInner>
        <VariantDetail form={form} variantDetail={variant as Variant} />
      </ContentInner>
      
      <Modal
        title="Delete Variant"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteVariantStart({ variantId: variantId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this variant? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default VariantDetailPage;