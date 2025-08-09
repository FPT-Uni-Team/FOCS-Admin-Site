import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { TableListParams } from "../../type/table/table";
import { fetchTablesStart } from "../../store/slices/table/tableListSlice";
import TableList from "../../components/table/tableList/TableList";
import { useEffect } from "react";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const TableListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();

  const fetchData = async (params: TableListParams) => {
    dispatch(fetchTablesStart(params));
  };

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  if (!storeId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title="Table List"
        onCreate={() => {
          navigate(`/${storeId}/tables/create`);
        }}
      />
      <TableList fetchData={fetchData} storeId={storeId || ""} />
    </>
  );
};

export default TableListPage;
