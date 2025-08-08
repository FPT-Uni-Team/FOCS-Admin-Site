import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";

import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchWorkshiftDetailStart } from "../../store/slices/workshift/workshiftDetailSlice";
import WorkshiftDetail from "../../components/workshift/workshiftDetail/WorkshiftDetail";
import { showNotification } from "../../components/common/Notification/ToastCustom";

const WorkshiftDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { workshiftDetail, loading, error } = useAppSelector(
    (state) => state.workshiftDetail
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

  const handleDeleteWorkshift = () => {
    setIsDeleteModalOpen(true);
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
        title={`Workshift - ${workshiftDetail.workDate}`}
        contentModal="this workshift"
        onEdit={() => {
          navigate(`/workshifts/${id}/update`);
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
        onOk={() => {
          setIsDeleteModalOpen(false);
          // TODO: Implement delete functionality
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this workshift? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default WorkshiftDetailPage; 