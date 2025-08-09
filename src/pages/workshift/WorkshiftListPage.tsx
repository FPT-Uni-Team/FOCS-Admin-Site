import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { fetchWorkshiftListStart } from "../../store/slices/workshift/workshiftListSlice";
import WorkshiftList from "../../components/workshift/workshiftList/WorkshiftList";
import type { WorkshiftListParams } from "../../type/workshift/workshift";
import TitleLine from "../../components/common/Title/TitleLine";

const WorkshiftListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();

  const fetchData = useCallback(
    async (params: WorkshiftListParams) => {
      dispatch(fetchWorkshiftListStart(params));
    },
    [dispatch]
  );

  return (
    <>
      <TitleLine
        title="Workshift List"
        onCreate={() => {
          navigate(`/${storeId}/workshifts/create`);
        }}
      />
      <WorkshiftList fetchData={fetchData} storeId={storeId || ""} />
    </>
  );
};

export default WorkshiftListPage;
