import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { fetchCustomerDetailStart } from "../../store/slices/customer/customerDetailSlice";
import CustomerForm from "../../components/category/CategoryForm";
import { changeCustomerStatusStart } from "../../store/slices/customer/customerChangeStatusSlice";
const CustomerDetailPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector((state) => state.customerDetail);
  const { customerId } = useParams();

  const fetchChangeStatusCustomer = (category: string, categoryId: string) => {
    dispatch(
      changeCustomerStatusStart(
        category == "active" ? "block" : "unblock",
        categoryId
      )
    );
  };

  useEffect(() => {
    dispatch(fetchCustomerDetailStart(customerId || ""));
  }, [dispatch, customerId]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Customer",
          link: `/${sessionStorage.getItem("storeId")}/customer`,
        },
        { name: customer.first_name + customer.last_name },
      ])
    );
  }, [customer.first_name, customer.last_name, dispatch]);
  return (
    <>
      <TitleLine
        title={customer.first_name + customer.last_name}
        status={"Available"}
        isActive={0}
        contentModal="this customer"
        onAction={fetchChangeStatusCustomer}
        hasMoreAction
        promotionId={customerId}
      />
      <CustomerForm form={form} initData={customer} />
    </>
  );
};

export default CustomerDetailPage;
