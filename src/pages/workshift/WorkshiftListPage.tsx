import { useCallback, useEffect, useState } from "react";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchWorkshiftListStart } from "../../store/slices/workshift/workshiftListSlice";
import WorkshiftList from "../../components/workshift/workshiftList/WorkshiftList";
import type { WorkshiftListParams } from "../../type/workshift/workshift";

const WorkshiftListPage = () => {
  const dispatch = useAppDispatch();
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    const defaultStoreId = localStorage.getItem("storeId");
    const currentStoreId = storedStoreId || defaultStoreId;
    setStoreId(currentStoreId as string);
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
          // TODO: Navigate to create workshift page if needed
          console.log("Create workshift");
        }}
      />
      <WorkshiftList fetchData={fetchData} storeId={storeId} />
    </>
  );
};

export default WorkshiftListPage;
