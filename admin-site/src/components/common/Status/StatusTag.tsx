import React from "react";
import { Tag } from "antd";
import styles from "./StatusTag.module.scss";

interface StatusTagProps {
  status: string;
}

const statusColorMap: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  notstart: "Not Start",
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const normalized = status.replace(" ", "").toLowerCase();
  const statusInfo = statusColorMap[normalized];
  if (!statusInfo) {
    return <Tag color="default">{status}</Tag>;
  }
  return (
    <Tag className={styles[`custom-${normalized}`]}>{statusInfo || status}</Tag>
  );
};

export default StatusTag;
