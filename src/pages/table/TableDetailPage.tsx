import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import TableDetail from "../../components/table/tableDetail/TableDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTableDetailStart } from "../../store/slices/table/tableDetailSlice";
import { TableStatusLabel } from "../../type/table/table";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";

const TableDetailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();
  const { table } = useAppSelector((state) => state.tableDetail);

  const fetchChangeStatusTable = (category: string, tableId: string) => {
    // TODO: Implement table status change logic
    console.log("Change table status:", category, tableId);
  };

  useEffect(() => {
    if (tableId) {
      dispatch(fetchTableDetailStart(tableId));
    }
  }, [dispatch, tableId]);

  return (
    <>
      <TitleLine
        title={`Table ${table.table_number}`}
        status={
          TableStatusLabel[table.status as keyof typeof TableStatusLabel]
        }
        isActive={checkActive(
          TableStatusLabel[table.status as keyof typeof TableStatusLabel]
        )}
        contentModal="this table"
        onAction={fetchChangeStatusTable}
        onEdit={() => {
          navigate(`/tables/update/${tableId}`);
        }}
        hasMoreAction
        promotionId={tableId}
        isShowEdit={checkShowEdit(
          TableStatusLabel[table.status as keyof typeof TableStatusLabel]
        )}
      />
      <TableDetail tableDetail={table} />
    </>
  );
};

export default TableDetailPage; 