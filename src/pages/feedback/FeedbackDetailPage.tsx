import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchFeedbackDetailStart,
  clearFeedbackDetail,
} from "../../store/slices/feedback/feedbackDetailSlice";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import FeedbackDetail from "../../components/feedback/feedbackDetail/FeedbackDetail";
import type { FeedbackListDataType } from "../../type/feedback/feedback";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const FeedbackDetailPage = () => {
  const dispatch = useAppDispatch();
  const { feedback } = useAppSelector((state) => state.feedbackDetail);
  const navigate = useNavigate();

  const { feedbackId, storeId } = useParams<{
    feedbackId: string;
    storeId: string;
  }>();

  const getStatusText = (isPublic: boolean) => {
    return isPublic ? "Public" : "Private";
  };

  const getStatusValue = (isPublic: boolean) => {
    return isPublic ? 1 : 0;
  };

  const handleEdit = () => {
    navigate(`/${storeId}/feedbacks/${feedbackId}/update`);
  };

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

  if (!feedback) {
    return <div>Feedback not found</div>;
  }

  return (
    <>
      <TitleLine
        title={`Feedback #${feedback.id.slice(0, 8)}`}
        status={getStatusText(feedback.is_public)}
        isActive={getStatusValue(feedback.is_public)}
        contentModal="this feedback"
        onEdit={handleEdit}
        hasMoreAction={true}
        promotionId={feedbackId}
        isShowEdit={true}
      />
      <ContentInner>
        <FeedbackDetail feedbackDetail={feedback as FeedbackListDataType} />
      </ContentInner>
    </>
  );
};

export default FeedbackDetailPage;
