import { type FC } from "react";
import { Card, Descriptions, Rate, Image, Typography, List } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";
import styles from "./FeedbackDetail.module.scss";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

const { Text, Title, Paragraph } = Typography;

interface FeedbackDetailProps {
  feedbackDetail: FeedbackListDataType;
}

const FeedbackDetail: FC<FeedbackDetailProps> = ({ feedbackDetail }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
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

      {feedbackDetail?.order && (
        <Card
          key={feedbackDetail.order.id}
          title={
            <span
              style={{ color: "#1677ff", cursor: "pointer" }}
              onClick={() =>
                navigate(`/${storeId}/orders/${feedbackDetail.order?.id}`)
              }
            >
              Order #{feedbackDetail.order.order_code}
            </span>
          }
          bordered
          style={{ marginBottom: 16 }}
        >
          {/* Order Info */}
          <div style={{ marginBottom: 12 }}>
            <Text strong>Date: </Text>
            <Text>
              {dayjs(feedbackDetail.order.created_at).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Text>
          </div>

          {/* Order Details */}
          <Title level={5} style={{ marginTop: 12 }}>
            Items
          </Title>
          <List
            dataSource={feedbackDetail.order.order_details}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Text>
                  <span
                    style={{ color: "#1677ff", cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/${storeId}/menu-items/${feedbackDetail.order?.id}`
                      )
                    }
                  >
                    {item.menu_item_name || "Unnamed Item"}
                  </span>{" "}
                  × {item.quantity} - {item.total_price.toLocaleString("vi-VN")}{" "}
                  VND
                </Text>
              </List.Item>
            )}
          />

          {/* Total */}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Text strong>
              Total: {feedbackDetail.order.total_amount.toLocaleString("vi-VN")}{" "}
              VND
            </Text>
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
