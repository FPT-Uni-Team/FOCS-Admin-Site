import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createStaffStart,
  resetCreateStaff,
} from "../../store/slices/staff/staffCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";
import StaffForm from "../../components/staff/staffForm/StaffForm";

const StaffPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success, error } = useAppSelector((state) => state.staffCreate);

  const handleCreateStaff = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const dataPayload = {
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
          phone: values.phone,
          first_name: values.first_name,
          last_name: values.last_name,
        };
        dispatch(createStaffStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Staff created successfully!");
      dispatch(resetCreateStaff());
      navigate("/staffs");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCreateStaff());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine title="New Staff" onCreate={handleCreateStaff} />
      <StaffForm form={form} mode="Create" />
    </>
  );
};

export default StaffPage;
