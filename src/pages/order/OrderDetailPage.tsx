import OrderDetail from "../../components/order/orderDetail/OrderDetail";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchOrderDetailStart } from "../../store/slices/order/orderDetailSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { OrderDTO } from "../../type/order/order";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import {
  getOrderStatusText,
} from "../../type/order/order";

const OrderDetailPage = () => {
  const dispatch = useAppDispatch();
  const { order, loading } = useAppSelector((state) => state.orderDetail);
  
  const { orderCode } = useParams<{ orderCode: string }>();

  useEffect(() => {
    if (orderCode) {
      dispatch(fetchOrderDetailStart({ orderCode }));
    }
  }, [orderCode, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <>
      <TitleLine
        title={`Order ${order.order_code}`}
        status={getOrderStatusText(order.order_status)}
        onEdit={() => {
          
        }}
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