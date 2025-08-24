import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchStaffListStart } from "../../store/slices/staff/staffListSlice";
import type { ListPageParams } from "../../type/common/common";
import StaffList from "../../components/staff/staffList/StaffList";
import { useEffect } from "react";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const StaffListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: ListPageParams) => {
    dispatch(fetchStaffListStart(params));
  };
  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title="Staff List"
        onCreate={() => {
          navigate("create");
        }}
      />
      <StaffList fetchData={fetchData} />
    </>
  );
};

export default StaffListPage;
