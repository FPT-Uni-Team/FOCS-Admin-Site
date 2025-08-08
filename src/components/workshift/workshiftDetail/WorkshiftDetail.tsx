import { type FC } from "react";
import { Table, Card, Descriptions, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import type { WorkshiftDetailResponseActual } from "../../../type/workshift/workshift";

import styles from "./WorkshiftDetail.module.scss";

interface WorkshiftDetailProps {
  workshiftDetail: WorkshiftDetailResponseActual | null;
  loading: boolean;
}

const WorkshiftDetail: FC<WorkshiftDetailProps> = ({ workshiftDetail, loading }) => {
  const columns: ColumnsType<WorkshiftDetailResponseActual['shift'][0]> = [
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      render: (text: string) => <span className={styles.staffName}>{text}</span>,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => (
        <Tag color="green" className={styles.timeTag}>
          {text}
        </Tag>
      ),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => (
        <Tag color="red" className={styles.timeTag}>
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <ContentInner>
      {workshiftDetail && (
        <Card title="Schedule Information" className={styles.scheduleInfo}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Work Date" span={1}>
              <span className="font-mono text-sm">{workshiftDetail.workDate}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Total Shifts" span={1}>
              <Tag color="blue" className={styles.timeTag}>
                {workshiftDetail.shift?.length || 0} shifts
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card title="Shift Details">
        <Table<WorkshiftDetailResponseActual['shift'][0]>
          columns={columns}
          dataSource={workshiftDetail?.shift || []}
          loading={loading}
          rowKey="staffId"
          pagination={false}
          className={styles.shiftTable}
        />
      </Card>
    </ContentInner>
  );
};

export default WorkshiftDetail; 