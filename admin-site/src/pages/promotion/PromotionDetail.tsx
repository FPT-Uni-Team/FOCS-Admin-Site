import { useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionDetail from "../../components/promotion/promotionDetail/PromotionDetail";
import { useEffect } from "react";
import { fetchPromotionDetailStart } from "../../store/slices/promotion/promotionDetailSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { PromotionStatusLabel } from "../../type/promotion/promotion";

const PromotionDetailPage = () => {
  const { promotionId } = useParams();
  const { promotion } = useAppSelector((state) => state.promotionDetail);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchPromotionDetailStart(promotionId || ""));
  }, [dispatch, promotionId]);
  return (
    <>
      <TitleLine
        title={promotion.title}
        status={
          PromotionStatusLabel[
            promotion.status as keyof typeof PromotionStatusLabel
          ]
        }
        onEdit={() => {}}
        hasMoreAction
      />
      <PromotionDetail promotionDetail={promotion} />
    </>
  );
};

export default PromotionDetailPage;
