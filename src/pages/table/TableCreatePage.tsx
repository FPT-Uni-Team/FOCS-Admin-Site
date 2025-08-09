import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import TableForm from "../../components/table/tableForm/TableForm";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createTableStart,
  resetTableCreate,
} from "../../store/slices/table/tableCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate, useParams } from "react-router-dom";
import type { TableCreateRequest } from "../../type/table/table";

const TableCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { success, error } = useAppSelector((state) => state.tableCreate);

  const handleCreateTable = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload: TableCreateRequest = {
          table_number: Number(allFormValues.table_number),
          status: allFormValues.status,
          is_active: allFormValues.is_active,
          store_id: allFormValues.store_id,
        };
        dispatch(createTableStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create table success!");
      dispatch(resetTableCreate());
      navigate(`/${storeId}/tables`);
    }
  }, [dispatch, navigate, success, storeId]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetTableCreate());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine title="New Table" onCreate={handleCreateTable} />
      <TableForm form={form} mode="Create" />
    </>
  );
};

export default TableCreatePage; 