import React, { useState } from "react";
import { Button, Dropdown, Modal } from "antd";
import { DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./TitleLine.module.scss";
import StatusTag from "../Status/StatusTag";

interface TitleProps {
  title?: string;
  status?: string;
  onEdit?: () => void;
  onAction?: (category: string, id: string) => void;
  hasMoreAction?: boolean;
  isActive?: number;
  onCreate?: () => void;
  createButtonText?: string;
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isDisableCreate?: boolean;
  contentModal?: string;
  promotionId?: string;
  isShowEdit?: boolean;
}

const TitleLine: React.FC<TitleProps> = ({
  title,
  status,
  onEdit,
  onAction,
  hasMoreAction,
  isActive,
  onCreate,
  createButtonText = "Create",
  step,
  totalSteps,
  onNext,
  onPrevious,
  isDisableCreate,
  contentModal,
  promotionId,
  isShowEdit = true,
}) => {
  const moreMenu = {
    items: [
      {
        key: "1",
        label: "View History",
      },
    ],
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.titleWrapper}>
      <div className={styles.titleContainer}>
        <h1 className={styles.titleText}>{title}</h1>
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

        {onAction && isActive !== 2 && (
          <>
            <Button
              onClick={() => setIsModalOpen(true)}
              danger={isActive == 0}
              variant="outlined"
            >
              {isActive == 1 ? "Reactivate" : "Deactivate"}
            </Button>
            <Modal
              title={`Confirm ${isActive == 1 ? "Reactivate" : "Deactivate"}`}
              open={isModalOpen}
              onOk={() => {
                setIsModalOpen(false);
                onAction(
                  isActive == 1 ? "active" : "deactive",
                  promotionId as string
                );
              }}
              onCancel={() => setIsModalOpen(false)}
            >
              Are you sure {isActive == 1 ? "reactivate" : "deactivate"}{" "}
              {contentModal}
            </Modal>
          </>
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
            {createButtonText}
          </Button>
        )}
        {onEdit && isShowEdit && (
          <Button
            icon={<EditOutlined />}
            onClick={onEdit}
            color="primary"
            variant="outlined"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default TitleLine;
