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
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const WorkshiftCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string>("");
  const { success, error } = useAppSelector((state) => state.workshiftCreate);
  const { staff } = useAppSelector((state) => state.staffList);

  useEffect(() => {
    const storedStoreId = sessionStorage.getItem("storeId");
    setStoreId(storedStoreId || "");
  }, []);

  const handleCreateWorkshift = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const dataPayload: WorkshiftCreatePayload = {
          workDate: dayjs(values.workDate).format("YYYY-MM-DD"),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shift: (values.shift || []).map((shift: any) => {
            return {
              staffs: staff
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((s: any) => shift.staffId.includes(s.id))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((s: any) => ({
                  staffId: s.id,
                  name: `${s.first_name} ${s.last_name}`,
                })),
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
      navigate(`/${sessionStorage.getItem("storeId")}/workshifts`);
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCreateWorkshift());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Workshifts",
          link: `/${sessionStorage.getItem("storeId")}/workshifts`,
        },
        { name: "New Workshift" },
      ])
    );
  }, [dispatch]);

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
