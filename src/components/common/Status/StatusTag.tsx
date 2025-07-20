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
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  maintenance: "Maintenance",
  unknown: "Unknown",
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  if (status === null || status === undefined) {
    return <Tag color="default">Unknown</Tag>;
  }

  const statusString = String(status);
  const normalized = statusString.replace(/ /g, "").toLowerCase();
  const statusInfo = statusColorMap[normalized];

  if (!statusInfo) {
    return <Tag color="default">{statusString}</Tag>;
  }

  return (
    <Tag className={clsx(styles[`${normalized}`], styles["custom-tag"])}>
      {statusInfo || statusString}
    </Tag>
  );
};

export default StatusTag;
