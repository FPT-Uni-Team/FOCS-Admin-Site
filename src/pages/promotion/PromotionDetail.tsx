import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import PromotionDetail from "../../components/promotion/promotionDetail/PromotionDetail";
import { useEffect, useState } from "react";
import { fetchPromotionDetailStart } from "../../store/slices/promotion/promotionDetailSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { PromotionStatusLabel } from "../../type/promotion/promotion";
import { changeStatusPromotionsStart } from "../../store/slices/promotion/promotionChangeStatusSlice";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  deletePromotionStart,
  clearDeletePromotionState,
} from "../../store/slices/promotion/promotionDeleteSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const PromotionDetailPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { promotionId } = useParams();
  const { promotion } = useAppSelector((state) => state.promotionDetail);
  const { success } = useAppSelector((state) => state.changeStatusPromotion);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.promotionDelete);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const fetchChangeStatusPromotion = (
    category: string,
    promotionId: string
  ) => {
    dispatch(changeStatusPromotionsStart(category, promotionId));
  };

  const handleDeletePromotion = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchPromotionDetailStart(promotionId || ""));
  }, [success, dispatch, promotionId]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete promotion success!");
      navigate(`/${sessionStorage.getItem("storeId")}/promotions`);
      dispatch(clearDeletePromotionState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeletePromotionState());
    }
  }, [deleteError, dispatch]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Promotions",
          link: `/${sessionStorage.getItem("storeId")}/promotions`,
        },
        { name: promotionId as string },
      ])
    );
  }, [promotionId, dispatch]);
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
          navigate(
            `/${localStorage.getItem(
              "storeId"
            )}/promotions/update/${promotionId}`
          );
        }}
        onDelete={handleDeletePromotion}
        hasMoreAction
        promotionId={promotionId}
        isShowEdit={checkShowEdit(
          PromotionStatusLabel[
            promotion.status as keyof typeof PromotionStatusLabel
          ]
        )}
        deleteLoading={deleteLoading}
      />
      <PromotionDetail promotionDetail={promotion} />
      <Modal
        title="Delete Promotion"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deletePromotionStart({ promotionId: promotionId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this promotion? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default PromotionDetailPage;
