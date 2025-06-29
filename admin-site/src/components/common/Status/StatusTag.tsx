import React from "react";
import { Tag } from "antd";
import styles from "./StatusTag.module.scss";
import clsx from "clsx";

interface StatusTagProps {
  status: string;
}

const statusColorMap: Record<string, string> = {
  ongoing: "On Going",
  expired: "Expired",
  notstart: "Not Start",
  unavailable: "UnAvailable",
  upcoming: "Up Coming",
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const normalized = status.replace(" ", "").toLowerCase();
  const statusInfo = statusColorMap[normalized];
  if (!statusInfo) {
    return <Tag color="default">{status}</Tag>;
  }
  return (
    <Tag className={clsx(styles[`custom-${normalized}`], styles["custom-tag"])}>
      {statusInfo || status}
    </Tag>
  );
};

export default StatusTag;
