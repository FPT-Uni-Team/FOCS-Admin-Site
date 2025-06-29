import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionDetail from "../../components/promotion/promotionDetail/PromotionDetail";
import { useEffect } from "react";
import { fetchPromotionDetailStart } from "../../store/slices/promotion/promotionDetailSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { PromotionStatusLabel } from "../../type/promotion/promotion";
import { changeStatusPromotionsStart } from "../../store/slices/promotion/promotionChangeStatusSlice";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";

const PromotionDetailPage = () => {
  const { promotionId } = useParams();
  const { promotion } = useAppSelector((state) => state.promotionDetail);
  const { success } = useAppSelector((state) => state.changeStatusPromotion);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const fetchChangeStatusPromotion = (
    category: string,
    promotionId: string
  ) => {
    dispatch(changeStatusPromotionsStart(category, promotionId));
  };
  useEffect(() => {
    dispatch(fetchPromotionDetailStart(promotionId || ""));
  }, [success, dispatch, promotionId]);
  return (
    <>
      <TitleLine
        title={promotion.title}
        status={
          PromotionStatusLabel[
            promotion.status as keyof typeof PromotionStatusLabel
          ]
        }
        isActive={checkActive(
          PromotionStatusLabel[
            promotion.status as keyof typeof PromotionStatusLabel
          ]
        )}
        contentModal="this promotion"
        onAction={fetchChangeStatusPromotion}
        onEdit={() => {
          navigate(`/promotions/update/${promotionId}`);
        }}
        hasMoreAction
        promotionId={promotionId}
        isShowEdit={checkShowEdit(
          PromotionStatusLabel[
            promotion.status as keyof typeof PromotionStatusLabel
          ]
        )}
      />
      <PromotionDetail promotionDetail={promotion} />
    </>
  );
};

export default PromotionDetailPage;
