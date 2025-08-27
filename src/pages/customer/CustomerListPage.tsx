import TitleLine from "../../components/common/Title/TitleLine";
import type { ListPageParams } from "../../type/common/common";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { fetchCustomersStart } from "../../store/slices/customer/customerList";
import CustomerList from "../../components/customer/customerList/CustomerList";

const CustomerListPage = () => {
  const dispatch = useAppDispatch();
  const fetchData = async (params: ListPageParams) => {
    dispatch(fetchCustomersStart(params));
  };

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine title="Customer List" />
      <CustomerList fetchData={fetchData} />
    </>
  );
};

export default CustomerListPage;
