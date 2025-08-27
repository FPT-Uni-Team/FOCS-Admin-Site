import { useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { Form, Switch, Card } from "antd";

import TitleLine from "../../components/common/Title/TitleLine";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

import { fetchFeedbackDetailStart } from "../../store/slices/feedback/feedbackDetailSlice";
import {
  updateFeedbackStart,
  resetUpdateFeedback,
} from "../../store/slices/feedback/feedbackUpdateSlice";
import { fetchFeedbacksStart } from "../../store/slices/feedback/feedbackListSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import type { FeedbackUpdateRequest } from "../../type/feedback/feedback";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const FeedbackUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { feedbackId, storeId } = useParams();

  const { feedback } = useAppSelector((state) => state.feedbackDetail);
  const { success, error } = useAppSelector((state) => state.feedbackUpdate);
  const { params } = useAppSelector((state) => state.feedbackList);

  const handleUpdateFeedback = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        const payload: FeedbackUpdateRequest = {
          public: values.public,
          reply: values.reply,
        };
        dispatch(
          updateFeedbackStart({
            feedbackId: feedbackId || "",
            payload,
          })
        );
      })
      .catch(() => {});
  }, [dispatch, form, feedbackId]);

  useEffect(() => {
    if (feedbackId) {
      dispatch(fetchFeedbackDetailStart({ feedbackId }));
    }
  }, [dispatch, feedbackId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update feedback success!");
      dispatch(resetUpdateFeedback());
      dispatch(fetchFeedbacksStart(params));
      if (feedbackId) {
        dispatch(fetchFeedbackDetailStart({ feedbackId }));
      }
      navigate(`/${storeId}/feedbacks/${feedbackId}`);
    }
  }, [dispatch, navigate, feedbackId, success, params]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetUpdateFeedback());
    }
  }, [dispatch, error]);

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
    return <div>Loading...</div>;
  }

  return (
    <>
      <TitleLine
        title={`Edit Feedback #${feedback.id.slice(0, 8)}`}
        status={feedback.is_public ? "Public" : "Private"}
        isActive={feedback.is_public ? 1 : 0}
        step={1}
        totalSteps={1}
        onCreate={handleUpdateFeedback}
        createButtonText="Update"
        onPrevious={() => navigate(`/${storeId}/feedbacks/${feedbackId}`)}
      />
      <ContentInner>
        <Card title="Feedback Information" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              public: feedback.is_public,
              reply: feedback.reply || "",
            }}
          >
            <Form.Item
              label="Public Status"
              name="public"
              valuePropName="checked"
            >
              <Switch checkedChildren="Public" unCheckedChildren="Private" />
            </Form.Item>
          </Form>
        </Card>
      </ContentInner>
    </>
  );
};

export default FeedbackUpdatePage;
