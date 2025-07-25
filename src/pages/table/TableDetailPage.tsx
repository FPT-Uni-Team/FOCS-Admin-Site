import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableDetail from "../../components/table/tableDetail/TableDetail";
import TableStatusSelector from "../../components/table/tableStatusSelector/TableStatusSelector";
import StatusTag from "../../components/common/Status/StatusTag";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTableDetailStart } from "../../store/slices/table/tableDetailSlice";
import { changeTableStatusStart, resetChangeTableStatus } from "../../store/slices/table/tableChangeStatusSlice";
import { TableStatusLabel } from "../../type/table/table";
import { checkShowEdit } from "../../helper/checkStatus";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { Button, Dropdown } from "antd";
import { DownOutlined, EditOutlined } from "@ant-design/icons";

const TableDetailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();
  const { table } = useAppSelector((state) => state.tableDetail);
  const { success, error } = useAppSelector((state) => state.changeTableStatus);

  const handleTableStatusChange = (tableId: string, newStatus: number) => {
    const storeId = table.store_id || "550e8400-e29b-41d4-a716-446655440000";
    dispatch(changeTableStatusStart(tableId, storeId, newStatus));
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

  return (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            Table {table.table_number}
          </h1>
          <StatusTag 
            status={TableStatusLabel[table.status as keyof typeof TableStatusLabel]} 
          />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <Dropdown 
            menu={{ 
              items: [{ key: "1", label: "View History" }] 
            }} 
            trigger={['click']}
          >
            <Button type="default" icon={<DownOutlined />} iconPosition="end">
              More
            </Button>
          </Dropdown>
          {checkShowEdit(TableStatusLabel[table.status as keyof typeof TableStatusLabel]) && (
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/tables/update/${tableId}`)}
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
    </>
  );
};

export default TableDetailPage; 