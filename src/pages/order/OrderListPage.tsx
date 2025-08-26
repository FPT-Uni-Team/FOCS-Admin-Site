import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { ListPageParams } from "../../type/common/common";
import { fetchOrdersStart } from "../../store/slices/order/orderListSlice";
import OrderList from "../../components/order/orderList/OrderList";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { useEffect } from "react";

const OrderListPage = () => {
  const dispatch = useAppDispatch();

  const fetchData = async (params: ListPageParams) => {
    dispatch(fetchOrdersStart(params));
  };

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine title="Order List" onCreate={undefined} />
      <OrderList fetchData={fetchData} />
    </>
  );
};

export default OrderListPage;
