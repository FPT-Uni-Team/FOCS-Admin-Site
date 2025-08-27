import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import TableForm from "../../components/table/tableForm/TableForm";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { fetchTableDetailStart } from "../../store/slices/table/tableDetailSlice";
import {
  updateTableStart,
  resetTableUpdate,
} from "../../store/slices/table/tableUpdateSlice";
import { TableStatusLabel } from "../../type/table/table";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const TableUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tableId, storeId } = useParams();
  const { table } = useAppSelector((state) => state.tableDetail);
  const { success, error } = useAppSelector((state) => state.tableUpdate);

  const handleUpdateTable = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        dispatch(updateTableStart({ id: String(tableId), data: values }));
      })
      .catch(() => {});
  }, [dispatch, form, tableId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update table success!");
      dispatch(resetTableUpdate());
      navigate(`/${storeId}/tables/${tableId}`);
    }
  }, [dispatch, navigate, tableId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetTableUpdate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchTableDetailStart(tableId));
    }
  }, [dispatch, tableId]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Tables",
          link: `/${sessionStorage.getItem("storeId")}/tables`,
        },
        { name: `Table ${table.table_number}` },
      ])
    );
  }, [table.table_number, dispatch]);

  return (
    <>
      <TitleLine
        title={`Table ${table.table_number}`}
        status={TableStatusLabel[table.status as keyof typeof TableStatusLabel]}
        onCreate={handleUpdateTable}
        createButtonText="Update"
      />
      <TableForm form={form} mode="Update" initData={table} />
    </>
  );
};

export default TableUpdatePage;
