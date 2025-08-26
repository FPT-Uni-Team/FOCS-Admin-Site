import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import CouponList from "../../components/coupon/couponList/CouponList";
import { useAppDispatch } from "../../hooks/redux";
import { fetchCouponsStart } from "../../store/slices/coupon/couponListSlice";
import type { CouponListParams } from "../../type/coupon/coupon";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { useEffect } from "react";

const CouponListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: CouponListParams) => {
    dispatch(fetchCouponsStart(params));
  };
  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);
  return (
    <>
      <TitleLine
        title="Coupons List"
        onCreate={() => {
          navigate(`/${localStorage.getItem("storeId")}/create`);
        }}
      />
      <CouponList fetchData={fetchData} />
    </>
  );
};

export default CouponListPage;
