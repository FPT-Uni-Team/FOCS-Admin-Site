import { useForm } from "antd/es/form/Form";
import VariantGroupDetail from "../../components/variant/variantGroupDetail/VariantGroupDetail";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVariantGroupDetailStart } from "../../store/slices/variant/variantGroupDetailSlice";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { deleteVariantGroupStart, clearDeleteVariantGroupState } from "../../store/slices/variant/variantGroupDeleteSlice";

import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

const VariantGroupDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { variantGroupDetail } = useAppSelector((state) => state.variantGroupDetail);
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useAppSelector((state) => state.variantGroupDelete);

  const { variantGroupId } = useParams<{ variantGroupId: string }>();

  const handleDeleteVariantGroup = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchVariantGroupDetailStart(variantGroupId || ""));
  }, [dispatch, variantGroupId]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete variant group success!");
      navigate("/variant-groups");
      dispatch(clearDeleteVariantGroupState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteVariantGroupState());
    }
  }, [deleteError, dispatch]);

  if (!variantGroupDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title={variantGroupDetail.group_name}
        status="Available"
        isActive={1}
        contentModal="this variant group"
        onEdit={() => {
          navigate(`/variant-groups/${variantGroupId}/update`);
        }}
        onDelete={handleDeleteVariantGroup}
        hasMoreAction={true}
        promotionId={variantGroupId}
        isShowEdit={true}
        deleteLoading={deleteLoading}
      />
      <ContentInner>
        <VariantGroupDetail 
          form={form} 
          variantGroupDetail={variantGroupDetail} 
          mode="View"
        />
      </ContentInner>
      
      <Modal
        title="Delete Variant Group"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteVariantGroupStart({ variantGroupId: variantGroupId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this variant group? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default VariantGroupDetailPage;