import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchFeedbackDetailStart, clearFeedbackDetail } from "../../store/slices/feedback/feedbackDetailSlice";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import FeedbackDetail from "../../components/feedback/feedbackDetail/FeedbackDetail";
import type { FeedbackListDataType } from "../../type/feedback/feedback";

const FeedbackDetailPage = () => {
  const dispatch = useAppDispatch();
  const { feedback, loading } = useAppSelector((state) => state.feedbackDetail);

  const { feedbackId } = useParams<{ feedbackId: string }>();

  useEffect(() => {
    if (feedbackId) {
      dispatch(fetchFeedbackDetailStart({ feedbackId }));
    }
    
    return () => {
      dispatch(clearFeedbackDetail());
    };
  }, [feedbackId, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!feedback) {
    return <div>Feedback not found</div>;
  }

  const getStatusText = (isPublic: boolean) => {
    return isPublic ? "Public" : "Private";
  };

  const getStatusValue = (isPublic: boolean) => {
    return isPublic ? 1 : 0;
  };

  return (
    <>
      <TitleLine
        title={`Feedback #${feedback.id.slice(0, 8)}`}
        status={getStatusText(feedback.public)}
        isActive={getStatusValue(feedback.public)}
        contentModal="this feedback"
        onEdit={() => {
          // Handle edit if needed
        }}
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