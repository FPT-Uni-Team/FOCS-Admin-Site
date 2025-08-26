import { useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

import TitleLine from "../../components/common/Title/TitleLine";

import { fetchStaffDetailStart } from "../../store/slices/staff/staffDetailSlice";
import {
  updateStaffStart,
  resetStaffUpdate,
} from "../../store/slices/staff/staffUpdateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import StaffForm from "../../components/staff/staffForm/StaffForm";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const StaffUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { staffId } = useParams();

  const { staff } = useAppSelector((state) => state.staffDetail);
  const { success, error } = useAppSelector((state) => state.staffUpdate);

  const handleUpdateStaff = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const payload = {
          id: staffId || "",
          email: values.email,
          phone_number: values.phone,
          first_name: values.first_name,
          last_name: values.last_name,
          password: values.password,
          roles: values.roles,
        };
        dispatch(updateStaffStart(payload));
      })
      .catch(() => {});
  }, [dispatch, form, staffId]);

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffDetailStart(staffId));
    }
  }, [dispatch, staffId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update staff success!");
      dispatch(resetStaffUpdate());
      navigate(`/${localStorage.getItem("storeId")}/staffs/${staffId}`);
    }
  }, [dispatch, navigate, staffId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetStaffUpdate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Staffs",
          link: `/${localStorage.getItem("storeId")}/staffs`,
        },
        { name: `${staffId}` },
      ])
    );
  }, [staffId, dispatch]);

  return (
    <>
      <TitleLine
        title={`${staff.first_name} ${staff.last_name}`}
        onCreate={handleUpdateStaff}
        createButtonText="Update"
      />
      <StaffForm form={form} mode="Update" initData={staff} />
    </>
  );
};

export default StaffUpdatePage;
