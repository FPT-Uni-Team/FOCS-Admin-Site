import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionList from "../../components/promotion/promotionList/PromotionList";
import { useAppDispatch } from "../../hooks/redux";
import { fetchPromotionsStart } from "../../store/slices/promotion/promotionListSlice";
import type { PromotionListParams } from "../../type/promotion/promotion";

const PromotionListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: PromotionListParams) => {
    dispatch(fetchPromotionsStart(params));
  };
  return (
    <>
      <TitleLine
        title="Promotions List"
        onCreate={() => {
          navigate("/menu-item/create");
        }}
      />
      <PromotionList fetchData={fetchData} />
    </>
  );
};

export default PromotionListPage;
