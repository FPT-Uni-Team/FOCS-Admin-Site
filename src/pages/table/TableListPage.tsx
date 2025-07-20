import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { TableListParams } from "../../type/table/table";
import { fetchTablesStart } from "../../store/slices/table/tableListSlice";
import TableList from "../../components/table/tableList/TableList";
import { useEffect, useState } from "react";

const TableListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    const defaultStoreId = "550e8400-e29b-41d4-a716-446655440000";
    const currentStoreId = storedStoreId || defaultStoreId;
    setStoreId(currentStoreId);
  }, []);

  const fetchData = async (params: TableListParams) => {
    dispatch(fetchTablesStart(params));
  };

  if (!storeId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title="Table List"
        onCreate={() => {
          navigate("/tables/create");
        }}
      />
      <TableList fetchData={fetchData} storeId={storeId} />
    </>
  );
};

export default TableListPage; 