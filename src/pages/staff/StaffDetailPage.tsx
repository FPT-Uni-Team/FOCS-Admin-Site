import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import { fetchStaffDetailStart } from "../../store/slices/staff/staffDetailSlice";
import StaffForm from "../../components/staff/staffForm/StaffForm";

const StaffDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { staffId } = useParams();
  const { staff } = useAppSelector((state) => state.staffDetail);

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffDetailStart(staffId));
    }
  }, [dispatch, staffId]);

  return (
    <>
      <TitleLine
        title={`${staff.first_name} ${staff.last_name}`}
        onEdit={() => navigate(`/staffs/update/${staffId}`)}
        hasMoreAction
      />
      <StaffForm form={form} mode="Detail" initData={staff} />
    </>
  );
};

export default StaffDetailPage;
