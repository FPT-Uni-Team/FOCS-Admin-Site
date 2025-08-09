import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createWorkshiftStart,
  resetCreateWorkshift,
} from "../../store/slices/workshift/workshiftCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";
import WorkshiftForm from "../../components/workshift/workshiftForm/WorkshiftForm";
import type { WorkshiftCreatePayload } from "../../type/workshift/workshift";
import dayjs from "dayjs";

const WorkshiftCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string>("");
  const { success, error } = useAppSelector((state) => state.workshiftCreate);
  const { staff } = useAppSelector((state) => state.staffList);

  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    const defaultStoreId = "550e8400-e29b-41d4-a716-446655440000";
    const currentStoreId = storedStoreId || defaultStoreId;
    setStoreId(currentStoreId);
  }, []);

  const handleCreateWorkshift = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const dataPayload: WorkshiftCreatePayload = {
          workDate: dayjs(values.workDate).format("YYYY-MM-DD"),
          shift: (values.shift || []).map((shift: any) => {
            const selectedStaff = staff.find((s: any) => s.id === shift.staffId);
            return {
              staffId: shift.staffId,
              staffName: selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : "",
              startTime: shift.startTime,
              endTime: shift.endTime,
            };
          }),
        };
        dispatch(createWorkshiftStart(dataPayload, storeId));
      })
      .catch(() => {});
  }, [dispatch, form, storeId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Workshift created successfully!");
      dispatch(resetCreateWorkshift());
      navigate("/workshifts");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCreateWorkshift());
    }
  }, [dispatch, error]);

  if (!storeId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine title="New Workshift" onCreate={handleCreateWorkshift} />
      <WorkshiftForm form={form} mode="Create" />
    </>
  );
};

export default WorkshiftCreatePage; 