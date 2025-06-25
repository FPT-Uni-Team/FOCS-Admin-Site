import { useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionDetail from "../../components/promotion/promotionDetail/PromotionDetail";
import { useEffect } from "react";
import { fetchPromotionDetailStart } from "../../store/slices/promotion/promotionDetailSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const PromotionDetailPage = () => {
  const { promotionId } = useParams();
  const { promotion } = useAppSelector((state) => state.promotionDetail);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchPromotionDetailStart(promotionId || ""));
  }, [dispatch, promotionId]);
  return (
    <>
      <TitleLine title="Test" />
      <PromotionDetail promotionDetail={promotion} />
    </>
  );
};

export default PromotionDetailPage;
