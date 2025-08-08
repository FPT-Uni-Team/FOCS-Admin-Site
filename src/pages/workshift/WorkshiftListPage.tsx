import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchWorkshiftListStart } from "../../store/slices/workshift/workshiftListSlice";
import WorkshiftList from "../../components/workshift/workshiftList/WorkshiftList";
import type { WorkshiftListParams } from "../../type/workshift/workshift";

const WorkshiftListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    const defaultStoreId = "550e8400-e29b-41d4-a716-446655440000";
    const currentStoreId = storedStoreId || defaultStoreId;
    setStoreId(currentStoreId);
  }, []);
  
  const fetchData = useCallback(
    async (params: WorkshiftListParams) => {
      dispatch(fetchWorkshiftListStart(params));
    },
    [dispatch]
  );

  if (!storeId) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <TitleLine
        title="Workshift List"
        onCreate={() => {
          navigate("/workshifts/create");
        }}
      />
      <WorkshiftList fetchData={fetchData} storeId={storeId} />
    </>
  );
};

export default WorkshiftListPage; 