import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchWorkshiftDetailStart } from "../../store/slices/workshift/workshiftDetailSlice";
import WorkshiftDetail from "../../components/workshift/workshiftDetail/WorkshiftDetail";
import { showNotification } from "../../components/common/Notification/ToastCustom";

const WorkshiftDetailPage = () => {
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

  const handleBack = () => {
    navigate("/workshifts");
  };

  if (!id) {
    return <div>ID not found</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className="mb-4"
        >
          Back to Workshift List
        </Button>
      </div>
      
      <WorkshiftDetail 
        workshiftDetail={workshiftDetail} 
        loading={loading} 
      />
    </>
  );
};

export default WorkshiftDetailPage; 