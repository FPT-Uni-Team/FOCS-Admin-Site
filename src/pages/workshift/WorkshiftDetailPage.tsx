import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import dayjs from "dayjs";

import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchWorkshiftDetailStart } from "../../store/slices/workshift/workshiftDetailSlice";
import { deleteWorkshiftStart, clearDeleteWorkshiftState } from "../../store/slices/workshift/workshiftDeleteSlice";
import WorkshiftDetail from "../../components/workshift/workshiftDetail/WorkshiftDetail";
import { showNotification } from "../../components/common/Notification/ToastCustom";

const WorkshiftDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, storeId } = useParams();
  
  const { workshiftDetail, loading, error } = useAppSelector(
    (state) => state.workshiftDetail
  );
  
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useAppSelector(
    (state) => state.workshiftDelete
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkshiftDetailStart(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Workshift deleted successfully");
      dispatch(clearDeleteWorkshiftState());
      navigate(`/${storeId}/workshifts`);
    }
  }, [deleteSuccess, dispatch, navigate]);

  const handleDeleteWorkshift = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (id) {
      dispatch(deleteWorkshiftStart({ workshiftId: id }));
      setIsDeleteModalOpen(false);
    }
  };

  if (!id) {
    return <div>ID not found</div>;
  }

  if (loading || !workshiftDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title={`Workshift - ${workshiftDetail.workDate ? dayjs(workshiftDetail.workDate).format('YYYY-MM-DD') : ''}`}
        contentModal="this workshift"
        onEdit={() => {
          navigate(`/${storeId}/workshifts/${id}/update`);
        }}
        onDelete={handleDeleteWorkshift}
        hasMoreAction={true}
        promotionId={id}
        isShowEdit={true}
      />
      
      <WorkshiftDetail 
        form={form}
        workshiftDetail={workshiftDetail} 
        mode="View"
      />
      
      <Modal
        title="Delete Workshift"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        confirmLoading={deleteLoading}
      >
        <p>Are you sure you want to delete this workshift? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default WorkshiftDetailPage; 