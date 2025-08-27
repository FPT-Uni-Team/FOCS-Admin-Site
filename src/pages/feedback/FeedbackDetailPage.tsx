import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchFeedbackDetailStart,
  clearFeedbackDetail,
} from "../../store/slices/feedback/feedbackDetailSlice";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import FeedbackDetail from "../../components/feedback/feedbackDetail/FeedbackDetail";
import type {
  FeedbackListDataType,
  FeedbackUpdateRequest,
} from "../../type/feedback/feedback";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  resetUpdateFeedback,
  updateFeedbackStart,
} from "../../store/slices/feedback/feedbackUpdateSlice";

const FeedbackDetailPage = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((state) => state.feedbackUpdate);
  const { params } = useAppSelector((state) => state.feedbackList);
  const { feedback } = useAppSelector((state) => state.feedbackDetail);
  const navigate = useNavigate();

  const { feedbackId } = useParams<{
    feedbackId: string;
    storeId: string;
  }>();

  const getStatusText = (isPublic: boolean) => {
    return isPublic ? "Public" : "Private";
  };

  const getStatusValue = (isPublic: boolean) => {
    return isPublic ? 0 : 1;
  };

  const handleAction = (active: string) => {
    const payload: FeedbackUpdateRequest = {
      public: active === "active" ? true : false,
      reply: "",
    };
    dispatch(
      updateFeedbackStart({
        feedbackId: feedbackId || "",
        payload,
      })
    );
  };

  useEffect(() => {
    if (success) {
      showNotification("success", "Update feedback success!");
      dispatch(resetUpdateFeedback());
      if (feedbackId) {
        dispatch(fetchFeedbackDetailStart({ feedbackId }));
      }
    }
  }, [dispatch, navigate, feedbackId, success, params]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetUpdateFeedback());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (feedbackId) {
      dispatch(fetchFeedbackDetailStart({ feedbackId }));
    }
    return () => {
      dispatch(clearFeedbackDetail());
    };
  }, [feedbackId, dispatch]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Feedbacks",
          link: `/${sessionStorage.getItem("storeId")}/feedbacks`,
        },
        { name: `${feedbackId}` },
      ])
    );
  }, [feedbackId, dispatch]);

  return (
    <>
      <TitleLine
        title={`Feedback #${feedback?.id.slice(0, 8)}`}
        status={getStatusText(feedback?.is_public as boolean)}
        isActive={getStatusValue(feedback?.is_public as boolean)}
        hasMoreAction={true}
        promotionId={feedbackId}
        onAction={handleAction}
      />
      <ContentInner style={{ minHeight: "fit-content" }}>
        <FeedbackDetail feedbackDetail={feedback as FeedbackListDataType} />
      </ContentInner>
    </>
  );
};

export default FeedbackDetailPage;
