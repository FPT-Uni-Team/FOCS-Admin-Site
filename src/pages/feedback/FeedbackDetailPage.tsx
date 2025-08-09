import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { 
  fetchFeedbackDetailStart, 
  clearFeedbackDetail
} from "../../store/slices/feedback/feedbackDetailSlice";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import TitleLine from "../../components/common/Title/TitleLine";
import FeedbackDetail from "../../components/feedback/feedbackDetail/FeedbackDetail";
import type { FeedbackListDataType } from "../../type/feedback/feedback";

const FeedbackDetailPage = () => {
  const dispatch = useAppDispatch();
  const { feedback, loading } = useAppSelector((state) => state.feedbackDetail);
  const navigate = useNavigate();

  const { feedbackId, storeId } = useParams<{ feedbackId: string; storeId: string }>();

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

  const handleEdit = () => {
    navigate(`/${storeId}/feedbacks/${feedbackId}/update`);
  };
  
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