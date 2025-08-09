import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableDetail from "../../components/table/tableDetail/TableDetail";
import TableStatusSelector from "../../components/table/tableStatusSelector/TableStatusSelector";
import StatusTag from "../../components/common/Status/StatusTag";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTableDetailStart } from "../../store/slices/table/tableDetailSlice";
import {
  changeTableStatusStart,
  resetChangeTableStatus,
} from "../../store/slices/table/tableChangeStatusSlice";
import { TableStatusLabel } from "../../type/table/table";
import { checkShowEdit, checkShowDelete } from "../../helper/checkStatus";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { Button, Dropdown, Modal } from "antd";
import { DownOutlined, EditOutlined } from "@ant-design/icons";
import {
  deleteTableStart,
  clearDeleteTableState,
} from "../../store/slices/table/tableDeleteSlice";

const TableDetailPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tableId, storeId } = useParams<{ tableId: string; storeId: string }>();
  const { table } = useAppSelector((state) => state.tableDetail);
  const { success, error } = useAppSelector((state) => state.changeTableStatus);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.tableDelete);

  const handleTableStatusChange = (tableId: string, newStatus: number) => {
    const storeId = table.store_id;
    dispatch(changeTableStatusStart(tableId, storeId, newStatus));
  };

  const handleDeleteTable = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (tableId) {
      dispatch(fetchTableDetailStart(tableId));
    }
  }, [dispatch, tableId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Table status changed successfully!");
      dispatch(resetChangeTableStatus());
      if (tableId) {
        dispatch(fetchTableDetailStart(tableId));
      }
    }
  }, [dispatch, success, tableId]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetChangeTableStatus());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete table success!");
      navigate(`/${storeId}/tables`);
      dispatch(clearDeleteTableState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteTableState());
    }
  }, [deleteError, dispatch]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
            Table {table.table_number}
          </h1>
          <StatusTag
            status={
              TableStatusLabel[table.status as keyof typeof TableStatusLabel]
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {checkShowDelete(
            TableStatusLabel[table.status as keyof typeof TableStatusLabel]
          ) && (
            <Button
              type="primary"
              danger
              onClick={handleDeleteTable}
              disabled={deleteLoading}
            >
              Delete
            </Button>
          )}
          <Dropdown
            menu={{
              items: [{ key: "1", label: "View History" }],
            }}
            trigger={["click"]}
          >
            <Button type="default" icon={<DownOutlined />} iconPosition="end">
              More
            </Button>
          </Dropdown>
          {checkShowEdit(
            TableStatusLabel[table.status as keyof typeof TableStatusLabel]
          ) && (
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/${storeId}/tables/update/${tableId}`)}
              color="primary"
              variant="outlined"
            >
              Edit
            </Button>
          )}
          <TableStatusSelector
            currentStatus={table.status}
            tableId={tableId || ""}
            onStatusChange={handleTableStatusChange}
          />
        </div>
      </div>
      <TableDetail tableDetail={table} />

      <Modal
        title="Delete Table"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteTableStart({ tableId: tableId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this table? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default TableDetailPage;
