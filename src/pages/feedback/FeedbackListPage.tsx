import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { ListPageParams } from "../../type/common/common";
import { fetchFeedbacksStart } from "../../store/slices/feedback/feedbackListSlice";
import FeedbackList from "../../components/feedback/feedbackList/FeedbackList";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { useEffect } from "react";

const FeedbackListPage = () => {
  const dispatch = useAppDispatch();

  const fetchData = async (params: ListPageParams) => {
    dispatch(fetchFeedbacksStart(params));
  };

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine title="Feedback List" />
      <FeedbackList fetchData={fetchData} />
    </>
  );
};

export default FeedbackListPage;
