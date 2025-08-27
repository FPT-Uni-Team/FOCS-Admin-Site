import { type FC } from "react";
import { Card, Descriptions, Rate, Image, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";
import styles from "./FeedbackDetail.module.scss";

const { Paragraph } = Typography;

interface FeedbackDetailProps {
  feedbackDetail: FeedbackListDataType;
}

const FeedbackDetail: FC<FeedbackDetailProps> = ({ feedbackDetail }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const items = [
    {
      key: "rating",
      label: "Rating",
      children: (
        <div>
          <Rate disabled value={feedbackDetail?.rating} />
          <span style={{ marginLeft: 8 }}>({feedbackDetail?.rating}/5)</span>
        </div>
      ),
    },
    {
      key: "is_public",
      label: "Public",
      children: (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: feedbackDetail?.is_public ? "#f6ffed" : "#fff2e8",
            color: feedbackDetail?.is_public ? "#52c41a" : "#fa8c16",
            border: `1px solid ${
              feedbackDetail?.is_public ? "#52c41a" : "#fa8c16"
            }`,
          }}
        >
          {feedbackDetail?.is_public ? "True" : "False"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: (
        <>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Created At
        </>
      ),
      children: formatDate(feedbackDetail?.created_at),
    },
  ];

  return (
    <div className={styles.feedbackDetail}>
      <Card title="Feedback Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} items={items} size="small" />
      </Card>

      <Card title="Comment" style={{ marginBottom: 16 }}>
        <Paragraph>
          {feedbackDetail?.comment || "No comment provided"}
        </Paragraph>
      </Card>

      {feedbackDetail?.images && feedbackDetail?.images.length > 0 && (
        <Card title="Images" style={{ marginBottom: 16 }}>
          <div className={styles.imageGallery}>
            <Image.PreviewGroup>
              {feedbackDetail?.images.map((imageUrl, index) => (
                <Image
                  key={index}
                  width={150}
                  height={150}
                  src={imageUrl}
                  alt={`Feedback image ${index + 1}`}
                  style={{
                    objectFit: "cover",
                    marginRight: 8,
                    marginBottom: 8,
                    borderRadius: 8,
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </Card>
      )}

      {feedbackDetail?.reply && (
        <Card title="Admin Reply" style={{ marginBottom: 16 }}>
          <Paragraph>{feedbackDetail?.reply}</Paragraph>
        </Card>
      )}
    </div>
  );
};

export default FeedbackDetail;
