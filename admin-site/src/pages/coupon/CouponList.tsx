import CouponList from "../../components/coupon/couponList/CouponList";
import { useAppDispatch } from "../../hooks/redux";
import { fetchCouponsStart } from "../../store/slices/coupon/couponListSlice";
import type { CouponListParams } from "../../type/coupon/coupon";

const CouponListPage = () => {
  const dispatch = useAppDispatch();
  const fetchData = async (params: CouponListParams) => {
    await dispatch(fetchCouponsStart(params));
  };
  return <CouponList fetchData={fetchData} />;
};

export default CouponListPage;
