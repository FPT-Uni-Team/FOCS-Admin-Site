import OrderDetail from "../../components/order/orderDetail/OrderDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchOrderDetailStart } from "../../store/slices/order/orderDetailSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { OrderDTO, OrderStatus } from "../../type/order/order";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import { getOrderStatusText } from "../../type/order/order";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const OrderDetailPage = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((state) => state.orderDetail);

  const { orderCode } = useParams<{ orderCode: string }>();

  useEffect(() => {
    if (orderCode) {
      dispatch(fetchOrderDetailStart({ orderCode }));
    }
  }, [orderCode, dispatch]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Orders",
          link: `/${sessionStorage.getItem("storeId")}/orders`,
        },
        { name: `${orderCode}` },
      ])
    );
  }, [orderCode, dispatch]);

  return (
    <>
      <TitleLine
        title={`Order ${order?.order_code}`}
        status={getOrderStatusText(order?.order_status as OrderStatus)}
        onEdit={() => {}}
        hasMoreAction={false}
        promotionId={orderCode}
        isShowEdit={false}
      />
      <ContentInner>
        <OrderDetail orderDetail={order as OrderDTO} />
      </ContentInner>
    </>
  );
};

export default OrderDetailPage;
