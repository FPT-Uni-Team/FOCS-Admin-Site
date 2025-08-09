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
    const defaultStoreId = localStorage.getItem("storeId");
    const currentStoreId = storedStoreId || defaultStoreId;
    setStoreId(currentStoreId as string);
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
