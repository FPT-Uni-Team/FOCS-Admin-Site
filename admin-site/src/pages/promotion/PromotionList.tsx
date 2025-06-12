import PromotionList from "../../components/promotion/promotionList/PromotionList";
import { useAppDispatch } from "../../hooks/redux";
import { fetchPromotionsStart } from "../../store/slices/promotion/promotionListSlice";
import type { PromotionListParams } from "../../type/promotion/promotion";

const PromotionListPage = () => {
  const dispatch = useAppDispatch();
  const fetchData = async (params: PromotionListParams) => {
    await dispatch(fetchPromotionsStart(params));
  };
  return <PromotionList fetchData={fetchData} />;
};

export default PromotionListPage;
