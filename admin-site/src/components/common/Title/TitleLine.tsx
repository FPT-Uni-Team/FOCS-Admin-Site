import React from "react";
import { Button, Dropdown, Typography } from "antd";
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
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isDisableCreate?: boolean;
}

const TitleLine: React.FC<TitleProps> = ({
  title,
  status,
  onEdit,
  onAction,
  hasMoreAction,
  isActive,
  onCreate,
  step,
  totalSteps,
  onNext,
  onPrevious,
  isDisableCreate,
}) => {
  const moreMenu = {
    items: [
      {
        key: "1",
        label: "View History",
      },
    ],
  };

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
          <Dropdown menu={moreMenu} trigger={["click"]}>
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
          <Button onClick={onAction} danger={isActive} variant="outlined">
            {isActive ? "Deactivate" : "Reactivate"}
          </Button>
        )}
        {typeof step === "number" && totalSteps && step && totalSteps > 1 && (
          <>
            {step > 1 && <Button onClick={onPrevious}>Previous</Button>}
            {step < totalSteps && <Button onClick={onNext}>Next</Button>}
          </>
        )}
        {onCreate && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={onCreate}
            disabled={isDisableCreate}
          >
            Create
          </Button>
        )}
      </div>
    </div>
  );
};

export default TitleLine;
