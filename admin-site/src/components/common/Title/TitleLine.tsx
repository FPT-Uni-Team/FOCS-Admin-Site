import React from "react";
import { Button, Dropdown, Menu, Typography } from "antd";
import { DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./TitleLine.module.scss";
import StatusTag from "../Status/StatusTag";

interface TitleProps {
  title?: string;
  status?: string;
  onEdit?: () => void;
  onAction?: () => void;
  hasMoreAction?: boolean;
  isActive?: boolean;
  onCreate?: () => void;
}

const TitleLine: React.FC<TitleProps> = ({
  title,
  status,
  onEdit,
  onAction,
  hasMoreAction,
  isActive,
  onCreate,
}) => {
  const moreMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "View History",
        },
      ]}
    />
  );

  return (
    <div className={styles.titleWrapper}>
      <div className={styles.titleContainer}>
        <Typography.Title level={2} className={styles.titleText}>
          {title}
        </Typography.Title>
        {status && <StatusTag status={status} />}
      </div>
      <div className={styles.actionButtons}>
        {hasMoreAction && (
          <Dropdown overlay={moreMenu} trigger={["click"]}>
            <Button type="default" icon={<DownOutlined />} iconPosition="end">
              More
            </Button>
          </Dropdown>
        )}
        {onEdit && (
          <Button
            icon={<EditOutlined />}
            onClick={onEdit}
            color="primary"
            variant="outlined"
          >
            Edit
          </Button>
        )}
        {onAction && (
          <Button
            onClick={onAction}
            color={isActive ? "danger" : "green"}
            variant="outlined"
          >
            {isActive ? "Deactivate" : "Reactivate"}
          </Button>
        )}
        {onCreate && (
          <Button icon={<PlusOutlined />} type="primary">
            Create
          </Button>
        )}
      </div>
    </div>
  );
};

export default TitleLine;
